import * as THREE from "three";
import { Element } from "./element.ts";
import type { Terrain } from "./terrain.ts";
import type { PathFinder } from "./path-finder.ts";
import { center } from "./position.ts";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const WALK_SPEED = 200;
const HEIGHT = 0.2;

export class Player extends Element {
  #camera;
  #terrain;
  #path_finder;
  constructor(camera: THREE.Camera, terrain: Terrain, path_finder: PathFinder) {
    const geometry = new THREE.CapsuleGeometry(0.3, HEIGHT, 8);
    const material = new THREE.MeshStandardMaterial({
      color: "red",
      flatShading: true,
    });
    super(geometry, material);
    this.position.set(0, HEIGHT * 2, 0);
    this.#camera = camera;
    this.#terrain = terrain;
    this.#path_finder = path_finder;
    window.addEventListener("mousedown", this.on_mouse_down.bind(this));
  }
  on_mouse_down(event: MouseEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, this.#camera);
    const intersects = raycaster.intersectObject(this.#terrain);
    if (intersects.length > 0) {
      const hit_point = intersects[0].point;
      const start_position = this.position;
      const end_position = center(
        new THREE.Vector3(hit_point.x, this.position.y, hit_point.z),
      );
      const path = this.#path_finder.search(start_position, end_position);
      this.walk(path);
    }
  }
  walk(path: THREE.Vector3[]) {
    if (path.length === 0) {
      return;
    }
    let index = 0;
    const id = setInterval(() => {
      if (index === path.length - 1) {
        clearInterval(id);
      }
      this.position.copy(path[index]);
      index++;
    }, WALK_SPEED);
  }
}
