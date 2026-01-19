// ---------- SCENE ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// ---------- CAMERA ----------
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 3, 6);

// ---------- RENDERER ----------
const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ---------- CONTROLS ----------
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ---------- LIGHTS ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// ---------- TEST CUBE (PROOF RENDERING WORKS) ----------
const testCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
scene.add(testCube);

// ---------- LOAD CAR MODEL ----------
let carModel;
let wheels = [];

const loader = new THREE.GLTFLoader();
loader.load(
  "./assets/car.glb",
  function (gltf) {
    carModel = gltf.scene;
    scene.remove(testCube); // remove test cube once model loads
    scene.add(carModel);

    carModel.traverse(function (child) {
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
  function (error) {
    console.error("GLB load error:", error);
  }
);

// ---------- UI ----------
document.getElementById("colorPicker").addEventListener("input", function (e) {
  if (!carModel) return;
  const color = new THREE.Color(e.target.value);

  carModel.traverse(function (child) {
    if (child.isMesh && child.material) {
      child.material.color.set(color);
    }
  });
});

let wheelsVisible = true;
document.getElementById("toggleWheels").addEventListener("click", function () {
  wheelsVisible = !wheelsVisible;
  wheels.forEach(w => (w.visible = wheelsVisible));
});

// ---------- RESIZE ----------
window.addEventListener("resize", function () {
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
