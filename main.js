// PROOF BACKGROUND
document.body.style.margin = "0";
document.body.style.overflow = "hidden";

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// RENDERER (FORCED ATTACH)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 1));

const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(5, 10, 5);
scene.add(dir);

// TEST OBJECT (ABSOLUTE PROOF)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
scene.add(cube);

// ANIMATE
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
