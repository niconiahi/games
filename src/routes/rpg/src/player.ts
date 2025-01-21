import * as THREE from "three";
import { Element } from "./element.ts";
import type { Terrain } from "./terrain.ts";
import { center } from "./position.ts";
import type { World } from "./world.ts";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export class Player extends Element {
  #camera;
  #terrain;
  #world;
  constructor(camera: THREE.Camera, terrain: Terrain, world: World) {
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
    this.#world = world;
    window.addEventListener("mousedown", this.on_mouse_down.bind(this));
  }
  on_mouse_down(event: MouseEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, this.#camera);
    const intersects = raycaster.intersectObject(this.#terrain);
    if (intersects.length > 0) {
      const hit_point = intersects[0].point;
      const position = center(
        this.#world.denormalize_position(
          new THREE.Vector3(hit_point.x, this.position.y, hit_point.z),
        ),
      );
      const element = this.#world.get_element(position);
      console.log("element", element);
      const elements = this.#world.get_elements();
      console.log("elements", elements);
      // this.position.copy(position);
    }
  }
}
