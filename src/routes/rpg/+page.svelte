<script>
import * as THREE from "three";
import GUI from "lil-gui";
import { World } from "./src/world.ts";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild(renderer.domElement);
renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio, 2));
renderer.setAnimationLoop(tick);

const scene = new THREE.Scene();

const aspect_ratio = globalThis.innerWidth / globalThis.innerHeight;
const camera = new THREE.OrthographicCamera(
  (globalThis.innerWidth * aspect_ratio) / -2,
  (globalThis.innerWidth * aspect_ratio) / 2,
  (globalThis.innerHeight * aspect_ratio) / 2,
  (globalThis.innerHeight * aspect_ratio) / -2,
  0.1,
  1000,
);
camera.position.set(4, 4, 4);
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.zoom = (globalThis.innerWidth * aspect_ratio) / 18;
camera.updateProjectionMatrix();
scene.add(camera);

const camera_helper = new THREE.CameraHelper(camera);
scene.add(camera_helper);
const canvas = document.querySelector("canvas");
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

const directional_light = new THREE.DirectionalLight();
scene.add(directional_light);
const ambient_light = new THREE.AmbientLight();
scene.add(ambient_light);

const gui = new GUI();
const object = {
  tree_count: 3,
  height: 10,
  width: 10,
};
gui.add(object, "tree_count", 1, 20, 1).name("Tree count");
gui.add(object, "height", 1, 20, 1).name("Height");
gui.add(object, "width", 1, 20, 1).name("Width");

const world = new World(object.width, object.height, object.tree_count);
scene.add(world);

function tick() {
  controls.update();
  renderer.render(scene, camera);
}
tick();
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }
</style>
