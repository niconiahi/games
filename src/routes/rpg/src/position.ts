import * as THREE from "three";

export function center(v: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(Math.floor(v.x) + 0.5, v.y, Math.floor(v.z) + 0.5);
}
