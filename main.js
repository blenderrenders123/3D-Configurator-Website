import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

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
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ---------- CONTROLS ----------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ---------- LIGHTS ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// ---------- LOAD MODEL ----------
let carModel;
let wheels = [];

const loader = new GLTFLoader();
loader.load(
  "./assets/car.glb",
  (gltf) => {
    carModel = gltf.scene;
    scene.add(carModel);

    // Collect wheels (by name)
    carModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name.toLowerCase().includes("wheel")) {
          wheels.push(child);
        }
      }
    });

    // AUTO-FRAME CAMERA (VERY IMPORTANT)
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
    if (child.isMesh) {
      // Change only paint-like materials
      if (
        child.material &&
        ["Body", "Paint", "CarPaint"].includes(child.material.name)
      ) {
        child.material.color.set(color);
      }
    }
  });
});

// ---------- UI: TOGGLE WHEELS ----------
let wheelsVisible = true;
document.getElementById("toggleWheels").addEventListener("click", () => {
  wheelsVisible = !wheelsVisible;
  wheels.forEach((wheel) => (wheel.visible = wheelsVisible));
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
