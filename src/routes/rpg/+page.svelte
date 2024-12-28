<script>
import * as THREE from "three";
import GUI from "lil-gui";
import { World } from "./src/world.ts";
import { Tree } from "./src/tree.ts";

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

console.log("height", globalThis.innerHeight * aspect_ratio);
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  flatShading: true,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const directional_light = new THREE.DirectionalLight();
scene.add(directional_light);
const ambient_light = new THREE.AmbientLight();
scene.add(ambient_light);

const gui = new GUI();
const object = {
  tree_count: 3,
  row_count: 10,
  column_count: 10,
};
gui.add(object, "tree_count", 1, 20, 1).name("Tree count");
gui.add(object, "row_count", 1, 20, 1).name("Row count");
gui.add(object, "column_count", 1, 20, 1).name("Column count");

function make_plane() {
  const geometry = new THREE.PlaneGeometry(
    object.column_count,
    object.row_count,
  );
  const material = new THREE.MeshStandardMaterial({ color: "green" });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  return plane;
}

const world = new World();
scene.add(world);

const plane = make_plane();
world.add(plane);

const tree = new Tree();
world.add(tree);
world.add(tree);
world.add(tree);

function tick() {
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
