import * as THREE from "three";
import { Element } from "./element.ts";
import { center } from "./position.ts";
import type { World } from "./world.ts";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const WALK_SPEED = 200;
const HEIGHT = 0.2;

export class Player extends Element {
  #width;
  #height;
  #camera;
  #terrain;
  #path_finder;
  #interval_id = 0;
  constructor(world: World) {
    const geometry = new THREE.CapsuleGeometry(0.3, HEIGHT, 8);
    const material = new THREE.MeshStandardMaterial({
      color: "red",
      flatShading: true,
    });
    super(geometry, material);
    this.position.set(0, HEIGHT * 2, 0);
    this.#width = world.width;
    this.#height = world.height;
    this.#camera = world.camera;
    this.#terrain = world.terrain;
    this.#path_finder = world.path_finder;
    window.addEventListener("mousedown", this.on_mouse_down.bind(this));
  }
  on_mouse_down(event: MouseEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, this.#camera);
    const intersects = raycaster.intersectObject(this.#terrain.mesh);
    if (intersects.length > 0) {
      const hit_point = new THREE.Vector3(
        intersects[0].point.x + this.#width / 2,
        0,
        intersects[0].point.z + this.#height / 2,
      );
      const start_position = this.position;
      const end_position = center(
        new THREE.Vector3(hit_point.x, this.position.y, hit_point.z),
      );
      const path = this.#path_finder.search(start_position, end_position);
      this.stop();
      this.walk(path);
    }
  }
  stop() {
    clearInterval(this.#interval_id);
  }
  walk(path: THREE.Vector3[]) {
    if (path.length === 0) {
      return;
    }
    let index = 0;
    this.#interval_id = setInterval(() => {
      if (index === path.length - 1) {
        this.stop();
        return;
      }
      this.position.copy(path[index]);
      index++;
    }, WALK_SPEED);
  }
}
