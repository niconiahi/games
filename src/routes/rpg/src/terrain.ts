import * as THREE from "three";

export class Terrain extends THREE.Mesh {
  constructor(width: number, height: number) {
    const geometry = new THREE.PlaneGeometry(width, height, width, height);
    const material = new THREE.MeshStandardMaterial({ color: "green" });
    super(geometry, material);
    this.rotation.x = -Math.PI / 2;
  }
}
