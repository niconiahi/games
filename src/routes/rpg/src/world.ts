import * as THREE from "three";
import { Terrain } from "./terrain";
import type { Element } from "./element";
import { Tree } from "./tree";
import { Rock } from "./rock";
import { Bush } from "./bush";

export class World extends THREE.Mesh {
  #map = new THREE.Group();
  #positions = new Set<string>();
  #width;
  #height;
  constructor(
    width: number,
    height: number,
    tree_count: number,
    rock_count: number,
    bushes_count: number,
  ) {
    super();
    this.#width = width;
    this.#height = height;
    this.make_terrain();
    this.make_grid();
    this.make_trees(tree_count);
    this.make_rocks(rock_count);
    this.make_bushes(bushes_count);
    this.add(this.#map);
  }
  serialize_coordinate(v: THREE.Vector3) {
    return `${v.x},${v.z}`;
  }
  decompose_normalized_position(v: THREE.Vector3) {
    return new THREE.Vector3(
      v.x + this.#width / 2 - 0.5,
      v.y,
      v.z + this.#height / 2 - 0.5,
    );
  }
  compose_normalized_position(v: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(
      v.x - this.#width / 2 + 0.5,
      v.y,
      v.z - this.#height / 2 + 0.5,
    );
  }
  add_position(v: THREE.Vector3) {
    this.#positions.add(this.serialize_coordinate(v));
  }
  compose_random_position(element: Element): THREE.Vector3 {
    const x = Math.floor(Math.random() * this.#width);
    const z = Math.floor(Math.random() * this.#height);
    const next_position = new THREE.Vector3(x, element.position.y, z);
    const next_serialized_position = this.serialize_coordinate(next_position);
    if (this.#positions.has(next_serialized_position)) {
      return this.compose_random_position(element);
    }
    return next_position;
  }
  remove_object(target: THREE.Object3D, parent: THREE.Group) {
    target.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            for (const m of object.material) {
              m.dispose();
            }
          } else {
            object.material.dispose();
          }
        }
      }
    });
    parent.remove(target);
    target.clear();
  }
  make_rocks(count: number) {
    const prev_rocks = this.#map.getObjectByName("rocks");
    if (prev_rocks) {
      this.remove_object(prev_rocks, this.#map);
    }
    const group = new THREE.Group();
    group.name = "rocks";
    for (let i = 0; i < count; i++) {
      const rock = new Rock();
      const random_position = this.compose_random_position(rock);
      const serialized_coordinate = this.serialize_coordinate(random_position);
      this.#positions.add(serialized_coordinate);
      const normalized_position =
        this.compose_normalized_position(random_position);
      rock.position.copy(normalized_position);
      console.log("adding a rock at", serialized_coordinate);
      group.add(rock);
    }
    this.#map.add(group);
  }
  make_trees(count: number) {
    const prev_trees = this.#map.getObjectByName("trees");
    if (prev_trees) {
      this.remove_object(prev_trees, this.#map);
    }
    const group = new THREE.Group();
    group.name = "trees";
    for (let i = 0; i < count; i++) {
      const tree = new Tree();
      const random_position = this.compose_random_position(tree);
      const serialized_coordinate = this.serialize_coordinate(random_position);
      this.#positions.add(serialized_coordinate);
      const normalized_position =
        this.compose_normalized_position(random_position);
      tree.position.copy(normalized_position);
      console.log("adding a tree at", serialized_coordinate);
      group.add(tree);
    }
    this.#map.add(group);
  }
  make_bushes(count: number) {
    const prev_bushes = this.#map.getObjectByName("bushes");
    if (prev_bushes) {
      this.remove_object(prev_bushes, this.#map);
    }
    const group = new THREE.Group();
    group.name = "bushes";
    for (let i = 0; i < count; i++) {
      const bush = new Bush();
      const random_position = this.compose_random_position(bush);
      const serialized_coordinate = this.serialize_coordinate(random_position);
      this.#positions.add(serialized_coordinate);
      const normalized_position =
        this.compose_normalized_position(random_position);
      bush.position.copy(normalized_position);
      console.log("adding a bush at", serialized_coordinate);
      group.add(bush);
    }
    this.#map.add(group);
  }
  make_grid() {
    const size = this.#width;
    const divisions = this.#height;
    const grid_helper = new THREE.GridHelper(size, divisions);
    this.add(grid_helper);
  }
  make_terrain() {
    const terrain = new Terrain(this.#width, this.#height);
    this.add(terrain);
  }
}
