// @ts-types="@types/three"
import * as THREE from "https://unpkg.com/three@0.171.0/build/three.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  globalThis.innerWidth / globalThis.innerHeight,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.translateOnAxis;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();
