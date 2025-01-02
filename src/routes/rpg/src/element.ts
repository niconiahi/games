import * as THREE from "three";

export class Element extends THREE.Mesh {
  place(v: THREE.Vector2) {
    const Z_POSITION = 0;
    this.position.set(v.x + 5, Z_POSITION, v.y);
  }
}
