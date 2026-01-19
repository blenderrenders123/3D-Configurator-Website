const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 1));

// PROOF CUBE (DO NOT REMOVE)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(cube);

// LOAD GLB (DUCK OR CAR)
const loader = new THREE.GLTFLoader();
loader.load(
  "./assets/car.glb",
  (gltf) => {
    console.log("MODEL LOADED");
    scene.remove(cube);
    scene.add(gltf.scene);
  },
  undefined,
  (err) => {
    console.error("GLTF ERROR", err);
    alert("GLB FAILED — CHECK CONSOLE");
  }
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
