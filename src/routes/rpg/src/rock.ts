import * as THREE from "three";
import { Element } from "./element.ts";

export class Rock extends Element {
  constructor() {
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
  }
}
