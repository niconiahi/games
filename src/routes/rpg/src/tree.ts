import * as THREE from "three";
import { Element } from "./element.ts";
import type { World } from "./world.ts";

export class Tree extends Element {
  constructor(world: World) {
    const HEIGHT = 1;
    const geometry = new THREE.ConeGeometry(0.3, HEIGHT, 8);
    const material = new THREE.MeshStandardMaterial({
      color: "#01796f",
      flatShading: true,
    });
    super(geometry, material);
    const random_position = world.get_random_position();
    const position = new THREE.Vector3(random_position.x, HEIGHT / 2, random_position.z);
    this.position.copy(position);
    console.log("creating a tree at position", this.position);
  }
}
