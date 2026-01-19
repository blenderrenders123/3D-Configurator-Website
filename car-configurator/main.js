import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 2, 6);

// Renderer
const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// Load Car Model
let carModel;
let wheels = [];

const loader = new GLTFLoader();
loader.load(
  "./assets/car.glb",
  (gltf) => {
    carModel = gltf.scene;
    scene.add(carModel);

    carModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;

        // Example: identify wheels by name
        if (child.name.toLowerCase().includes("wheel")) {
          wheels.push(child);
        }
      }
    });
  },
  undefined,
  (error) => console.error(error)
);

// UI – Color Change
document.getElementById("colorPicker").addEventListener("input", (e) => {
  if (!carModel) return;
  const color = new THREE.Color(e.target.value);

  carModel.traverse((child) => {
    if (child.isMesh && child.material.name === "Body") {
      child.material.color.set(color);
    }
  });
});

// UI – Toggle Wheels
let wheelsVisible = true;
document.getElementById("toggleWheels").addEventListener("click", () => {
  wheelsVisible = !wheelsVisible;
  wheels.forEach((wheel) => (wheel.visible = wheelsVisible));
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
