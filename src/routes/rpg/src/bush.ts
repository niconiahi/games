import * as THREE from "three";
import { Element } from "./element.ts";

export class Bush extends Element {
  constructor() {
    const HEIGHT = 0.3;
    const geometry = new THREE.SphereGeometry(HEIGHT, 8);
    const material = new THREE.MeshStandardMaterial({
      color: "#90EE90",
      flatShading: true,
    });
    super(geometry, material);
    this.position.set(0, HEIGHT, 0);
  }
}
