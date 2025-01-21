import * as THREE from "three";
import { Terrain } from "./terrain";
import type { Element } from "./element";
import { Tree } from "./tree";
import { Rock } from "./rock";
import { Bush } from "./bush";
import { Player } from "./player";
import { center } from "./position";

export class World extends THREE.Mesh {
  #map = new THREE.Group();
  #camera;
  #terrain;
  #elements = new Map<string, Element>();
  #width;
  #height;
  constructor(
    width: number,
    height: number,
    camera: THREE.Camera,
    tree_count: number,
    rock_count: number,
    bush_count: number,
  ) {
    super();
    this.#width = width;
    this.#height = height;
    this.#camera = camera;
    this.#terrain = this.make_terrain();
    this.make_grid();
    this.make_trees(tree_count);
    this.make_rocks(rock_count);
    this.make_bushes(bush_count);
    this.make_player();
    this.add(this.#map);
  }
  serialize_coordinate(v: THREE.Vector3) {
    return `${v.x},${v.z}`;
  }
  denormalize_position(v: THREE.Vector3) {
    return new THREE.Vector3(
      v.x + this.#width / 2,
      v.y,
      v.z + this.#height / 2,
    );
  }
  normalize_position(v: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(
      v.x - this.#width / 2,
      v.y,
      v.z - this.#height / 2,
    );
  }
  compose_random_position(element: Element): THREE.Vector3 {
    const x = Math.floor(Math.random() * this.#width);
    const z = Math.floor(Math.random() * this.#height);
    const next_position = new THREE.Vector3(x, element.position.y, z);
    const next_serialized_position = this.serialize_coordinate(next_position);
    if (this.#elements.has(next_serialized_position)) {
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
  get_elements() {
    return this.#elements;
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
      this.#elements.set(serialized_coordinate, rock);
      rock.name = `rock-${serialized_coordinate}`;
      const normalized_position = this.normalize_position(random_position);
      rock.position.copy(center(normalized_position));
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
      this.#elements.set(serialized_coordinate, tree);
      tree.name = `tree-${serialized_coordinate}`;
      const normalized_position = this.normalize_position(random_position);
      tree.position.copy(center(normalized_position));
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
      this.#elements.set(serialized_coordinate, bush);
      bush.name = `bush-${serialized_coordinate}`;
      const normalized_position = this.normalize_position(random_position);
      bush.position.copy(center(normalized_position));
      group.add(bush);
    }
    this.#map.add(group);
  }
  make_player() {
    const prev_players = this.#map.getObjectByName("players");
    if (prev_players) {
      this.remove_object(prev_players, this.#map);
    }
    const group = new THREE.Group();
    group.name = "players";
    const player = new Player(this.#camera, this.#terrain, this);
    const random_position = this.compose_random_position(player);
    const serialized_coordinate = this.serialize_coordinate(random_position);
    this.#elements.set(serialized_coordinate, player);
    player.name = `player-${serialized_coordinate}`;
    const normalized_position = this.normalize_position(random_position);
    player.position.copy(center(normalized_position));
    group.add(player);
    this.#map.add(group);
  }
  make_grid() {
    const size = this.#width;
    const divisions = this.#height;
    const grid_helper = new THREE.GridHelper(size, divisions);
    this.add(grid_helper);
  }
  get_element(position: THREE.Vector3) {
    const _position = new THREE.Vector3(
      Math.floor(position.x),
      position.y,
      Math.floor(position.z),
    );
    const serialized = this.serialize_coordinate(_position);
    return this.#elements.get(serialized);
  }
  make_terrain() {
    const terrain = new Terrain(this.#width, this.#height);
    this.add(terrain);
    return terrain;
  }
}
