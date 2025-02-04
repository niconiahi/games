import * as THREE from "three";
import { Element } from "./element.ts";
import type { World } from "./world.ts";

export class Bush extends Element {
  constructor(world: World) {
    const HEIGHT = 0.3;
    const geometry = new THREE.SphereGeometry(HEIGHT, 8);
    const material = new THREE.MeshStandardMaterial({
      color: "#90EE90",
      flatShading: true,
    });
    super(geometry, material);
    const random_position = world.get_random_position();
    const position = new THREE.Vector3(random_position.x, HEIGHT, random_position.z);
    this.position.copy(position);
    // console.log("creating a bush at position", this.position);
  }
}
