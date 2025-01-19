import * as THREE from "three";
import { Element } from "./element.ts";
import type { Terrain } from "./terrain.ts";
import type { World } from "./world.ts";
import { center_element } from "./position.ts";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export class Player extends Element {
  #camera;
  #terrain;
  constructor(camera: THREE.Camera, terrain: Terrain) {
    const HEIGHT = 0.2;
    const geometry = new THREE.CapsuleGeometry(0.3, HEIGHT, 8);
    const material = new THREE.MeshStandardMaterial({
      color: "red",
      flatShading: true,
    });
    super(geometry, material);
    this.position.set(0, HEIGHT * 2, 0);
    this.#camera = camera;
    this.#terrain = terrain;
    window.addEventListener("mousedown", this.on_mouse_down.bind(this));
  }
  on_mouse_down(event: MouseEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, this.#camera);
    const intersects = raycaster.intersectObject(this.#terrain);
    if (intersects.length > 0) {
      const hit_point = intersects[0].point;
      const position = center_element(
        new THREE.Vector3(hit_point.x, this.position.y, hit_point.z),
      );
      this.position.copy(position);
    }
  }
}
