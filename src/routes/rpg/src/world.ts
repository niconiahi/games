import * as THREE from "three";
import { Terrain } from "./terrain";
import type { Element } from "./element";
import { Tree } from "./tree";
import { Rock } from "./rock";
import { instance } from "valibot";

export class World extends THREE.Mesh {
  #map = new THREE.Group();
  #width;
  #height;
  constructor(
    width: number,
    height: number,
    tree_count: number,
    rock_count: number,
  ) {
    super();
    this.#width = width;
    this.#height = height;
    this.make_terrain();
    this.make_grid();
    this.make_trees(tree_count);
    this.make_rocks(rock_count);
    this.add(this.#map);
  }
  get_positions() {
    const positions: Set<string> = new Set<string>([]);
    this.#map.traverse((child) => {
      positions.add(this.serialize_coordinate(child.position));
    });
    return positions;
  }
  serialize_coordinate(v: THREE.Vector3) {
    return `${v.x},${v.y},${v.z}`;
  }
  deserialize_coordinate(serialized_v: string) {
    const [x, y, z] = serialized_v.split(",").map((coordinate) => {
      return Number(coordinate);
    });
    return new THREE.Vector3(x, y, z);
  }
  normalize_position(element: Element) {
    element.position.set(
      element.position.x - this.#width / 2 + 0.5,
      element.position.y,
      element.position.z - this.#height / 2 + 0.5,
    );
  }
  compose_random_position(element: Element) {
    const x = Math.floor(Math.random() * this.#width);
    const z = Math.floor(Math.random() * this.#height);
    const next_position = new THREE.Vector3(x, element.position.y, z);
    const positions = this.get_positions();
    if (positions.has(this.serialize_coordinate(next_position))) {
      this.compose_random_position(element);
    }
    element.position.copy(next_position);
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
      this.compose_random_position(rock);
      console.log(
        "adding a rock at",
        rock.position.x,
        rock.position.y,
        rock.position.z,
      );
      this.normalize_position(rock);
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
      this.compose_random_position(tree);
      console.log(
        "adding a tree at",
        tree.position.x,
        tree.position.y,
        tree.position.z,
      );
      this.normalize_position(tree);
      group.add(tree);
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
