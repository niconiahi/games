import * as THREE from "three";
import { Terrain } from "./terrain";
import type { Element } from "./element";
import { Tree } from "./tree";

export class World extends THREE.Mesh {
  #elements = new THREE.Group();
  #width;
  #height;
  constructor(width: number, height: number, tree_count: number) {
    super();
    this.#width = width;
    this.#height = height;
    this.make_terrain();
    this.make_grid();
    this.make_trees(tree_count);
    this.add(this.#elements);
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
    element.position.set(x, element.position.y, z);
  }
  make_trees(count: number) {
    for (let i = 0; i < count; i++) {
      const tree = new Tree();
      this.compose_random_position(tree);
      this.normalize_position(tree);
      this.#elements.add(tree);
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
