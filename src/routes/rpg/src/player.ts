import * as THREE from "three";
import { Element } from "./element.ts";
import type { Terrain } from "./terrain.ts";
import { center } from "./position.ts";
import type { World } from "./world.ts";
import type { PathFinder } from "./path-finder.ts";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export class Player extends Element {
  #camera;
  #terrain;
  #world;
  #path_finder;
  constructor(
    camera: THREE.Camera,
    terrain: Terrain,
    world: World,
    path_finder: PathFinder,
  ) {
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
        this.#world.denormalize_position(
          new THREE.Vector3(hit_point.x, this.position.y, hit_point.z),
        ),
      );
      this.#path_finder.search(start_position, end_position);
    }
  }
}
