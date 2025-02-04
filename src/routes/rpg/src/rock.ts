import * as THREE from "three";
import { Element } from "./element.ts";
import type { World } from "./world.ts";

export class Rock extends Element {
  constructor(world: World) {
    const SIZES = [0.2, 0.25, 0.3];
    const size = Math.floor(Math.random() * SIZES.length);
    const geometry = new THREE.SphereGeometry(
      SIZES[size],
      3,
      6,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2,
    );
    const material = new THREE.MeshStandardMaterial({
      color: "gray",
      flatShading: true,
    });
    super(geometry, material);
    const random_position = world.get_random_position();
    const position = new THREE.Vector3(
      random_position.x,
      this.position.y,
      random_position.z,
    );
    this.position.copy(position);
    console.log("creating a bush at position", this.position);
  }
}
