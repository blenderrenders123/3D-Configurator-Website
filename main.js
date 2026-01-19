// ---------- BASIC SETUP ----------
const loader = new THREE.GLTFLoader();
loader.load(
  "./assets/car.glb",
  (gltf) => {
    console.log("GLB LOADED SUCCESSFULLY");
    carModel = gltf.scene;
    scene.add(carModel);
  },
  (xhr) => {
    console.log("Loading progress:", (xhr.loaded / xhr.total) * 100 + "%");
  },
  (error) => {
    console.error("GLB LOAD FAILED:", error);
    alert("GLB failed to load. Check console.");
  }
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ---------- CONTROLS ----------
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ---------- LIGHTS ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// ---------- LOAD CAR MODEL ----------
let carModel;
let wheels = [];

const loader = new THREE.GLTFLoader();
loader.load("./assets/car.glb",

  (gltf) => {
    carModel = gltf.scene;
    scene.add(carModel);

    carModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.toLowerCase().includes("wheel")) {
          wheels.push(child);
        }
      }
    });

    // AUTO CAMERA FRAME
    const box = new THREE.Box3().setFromObject(carModel);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    controls.target.copy(center);
    camera.position.set(
      center.x + size * 1.2,
      center.y + size * 0.5,
      center.z + size * 1.2
    );
    camera.lookAt(center);
  },
  undefined,
  (error) => {
    console.error("GLB load error:", error);
  }
);

// ---------- UI: BODY COLOR ----------
document.getElementById("colorPicker").addEventListener("input", (e) => {
  if (!carModel) return;
  const color = new THREE.Color(e.target.value);

  carModel.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.color.set(color);
    }
  });
});

// ---------- UI: TOGGLE WHEELS ----------
let wheelsVisible = true;
document.getElementById("toggleWheels").addEventListener("click", () => {
  wheelsVisible = !wheelsVisible;
  wheels.forEach(wheel => wheel.visible = wheelsVisible);
});

// ---------- RESIZE ----------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- ANIMATE ----------
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

