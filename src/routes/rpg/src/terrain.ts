import * as THREE from "three";
import type { World } from "./world";

export class Terrain extends THREE.Group {
  map = new THREE.Group();
  mesh;
  constructor(world: World) {
    super();
    const { width, height } = world;
    const geometry = new THREE.PlaneGeometry(width, height, width, height);
    const material = new THREE.MeshStandardMaterial({ color: "green" });
    this.mesh = new THREE.Mesh(geometry, material);
    this.add(this.mesh);
    this.add(this.map);
    this.name = "Terrain";
    this.rotation.x = -Math.PI / 2;
    this.map.rotation.x = Math.PI / 2;
    this.map.position.set(-width / 2, height / 2, 0);
  }
}
