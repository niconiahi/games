import * as THREE from "three";
import type { World } from "./world";
import { center } from "./position";

export class PathFinder {
  #world;
  constructor(world: World) {
    this.#world = world;
  }
  search(start: THREE.Vector3, end: THREE.Vector3) {
    const _end = this.#world.denormalize_position(end);
    const _start = this.#world.denormalize_position(start);
    if (_end.x === _start.x && _end.z === _start.z) {
      return [];
    }
    const path: THREE.Vector3[] = [];
    const MAX_ATTEMPT_COUNT = 20;
    let found = false;
    let attemp = 1;
    while (!found) {
      if (attemp > MAX_ATTEMPT_COUNT) {
        break;
      }
      let next_candidate: THREE.Vector3;
      const last_position = path.at(-1);
      if (last_position) {
        next_candidate = last_position;
      } else {
        next_candidate = _start;
      }
      const neighboring_positions =
        this.get_neighboring_positions(next_candidate);
      if (
        neighboring_positions.some((neighbouring_position) => {
          return (
            this.#world.serialize_coordinate(neighbouring_position) ===
            this.#world.serialize_coordinate(_end)
          );
        })
      ) {
        found = true;
        path.push(_end);
        break;
      }
      const closest_position = this.get_closest_position(
        neighboring_positions,
        _end,
      );
      attemp++;
      path.push(closest_position);
    }
    return path.map((position) => {
      return this.#world.normalize_position(position);
    });
  }
  get_neighboring_positions(position: THREE.Vector3) {
    const positions: THREE.Vector3[] = [];
    // left
    if (position.x > 0.5) {
      const left_position = new THREE.Vector3(
        position.x - 1,
        position.y,
        position.z,
      );
      positions.push(left_position);
    }
    // right
    if (position.x < this.#world.width - 1) {
      const right_position = new THREE.Vector3(
        position.x + 1,
        position.y,
        position.z,
      );
      positions.push(right_position);
    }
    // top
    if (position.z > 0.5) {
      const top_position = new THREE.Vector3(
        position.x,
        position.y,
        position.z + 1,
      );
      positions.push(top_position);
    }
    // bottom
    if (position.z < this.#world.height - 1) {
      const top_position = new THREE.Vector3(
        position.x,
        position.y,
        position.z + 1,
      );
      positions.push(top_position);
    }
    return positions;
  }
  get_closest_position(positions: THREE.Vector3[], target: THREE.Vector3) {
    let closest = positions[0];
    for (const position of positions) {
      if (position.distanceTo(target) < closest.distanceTo(target)) {
        closest = position;
      }
    }
    return center(closest);
  }
}
