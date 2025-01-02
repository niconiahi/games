import * as THREE from "three";
import { Element } from "./element.ts";

export class Tree extends Element {
  constructor() {
    const HEIGHT = 0.5;
    const geometry = new THREE.ConeGeometry(0.3, HEIGHT, 8);
    const material = new THREE.MeshStandardMaterial({
      color: "#90EE90",
      flatShading: true,
    });
    super(geometry, material);
    this.position.set(0, HEIGHT / 2, 0);
  }
}
