import * as THREE from "three";
import { Terrain } from "./terrain";
import type { Element } from "./element";
import { Tree } from "./tree";

export class World extends THREE.Mesh {
  #map = new Map<THREE.Vector3, Element>();
  #width;
  #height;
  constructor(width: number, height: number, tree_count: number) {
    super();
    this.#width = width;
    this.#height = height;
    this.make_terrain();
    this.make_grid();
    this.make_trees(tree_count);
    for (const element of this.#map.values()) {
      this.add(element);
    }
  }
  normalize_position(element: Element) {
    element.position.set(
      element.position.x - this.#width / 2 + 0.5,
      element.position.y,
      element.position.z - this.#height / 2 + 0.5,
    );
  }
  get_free_z_cells() {
    const all_cells = Array.from({ length: this.#height }, (_, i) => {
      return i;
    });
    const free_cells: number[] = [];
    for (let z = 0; z < all_cells.length; z++) {
      if (
        this.#map.keys().some((coordinate) => {
          return coordinate.z === z;
        })
      ) {
        continue;
      }
      free_cells.push(z);
    }
    return free_cells;
  }
  get_free_x_cells() {
    const all_cells = Array.from({ length: this.#width }, (_, i) => {
      return i;
    });
    const free_cells: number[] = [];
    for (let x = 0; x < all_cells.length; x++) {
      if (
        this.#map.keys().some((coordinate) => {
          return coordinate.x === x;
        })
      ) {
        continue;
      }
      free_cells.push(x);
    }
    return free_cells;
  }
  get_random_number_from_list(list: number[]) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }
  compose_random_position(element: Element) {
    const x = this.get_random_number_from_list(this.get_free_x_cells());
    const z = this.get_random_number_from_list(this.get_free_z_cells());
    element.position.set(x, element.position.y, z);
  }
  make_trees(count: number) {
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
      this.#map.set(tree.position, tree);
    }
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
