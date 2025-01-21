import * as THREE from "three";
import type { World } from "./world";

export class PathFinder {
  #world;
  constructor(world: World) {
    this.#world = world;
  }
  search(start: THREE.Vector3, end: THREE.Vector3) {
    console.log("start_position", this.#world.serialize_coordinate(start));
    console.log("end_position", this.#world.serialize_coordinate(end));
    const element_start = this.#world.get_element(start);
    console.log("element_start", element_start);
    const element_end = this.#world.get_element(end);
    console.log("element_end", element_end);
    console.log("-------------");
    let found = false;
    while (!found) {
      const neighboring_positions = this.get_neighboring_positions(end);
      console.log("neighboring_positions", neighboring_positions);
      const closest_position = this.get_closest_position(
        neighboring_positions,
        end,
      );
      console.log("closest_position", closest_position);
      console.log("-------------");
      found = true;
    }
  }
  get_neighboring_positions(position: THREE.Vector3) {
    const positions = new Set<THREE.Vector3>();
    // left
    if (position.x > 0.5) {
      const left_position = new THREE.Vector3(
        position.x - 1,
        position.y,
        position.z,
      );
      positions.add(left_position);
    }
    // right
    if (position.x < this.#world.width - 1) {
      const right_position = new THREE.Vector3(
        position.x + 1,
        position.y,
        position.z,
      );
      positions.add(right_position);
    }
    // top
    if (position.z > 0.5) {
      const top_position = new THREE.Vector3(
        position.x,
        position.y,
        position.z + 1,
      );
      positions.add(top_position);
    }
    // bottom
    if (position.z < this.#world.height - 1) {
      const top_position = new THREE.Vector3(
        position.x,
        position.y,
        position.z - 1,
      );
      positions.add(top_position);
    }
    return positions;
  }
  get_closest_position(positions: Set<THREE.Vector3>, target: THREE.Vector3) {
    for (const position of positions) {
      console.log("position", position);
      console.log("distance", target.distanceTo(position));
    }
  }
}
