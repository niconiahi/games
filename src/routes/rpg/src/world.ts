import * as THREE from "three";
import { Terrain } from "./terrain";
import type { Element } from "./element";
import { Tree } from "./tree";
import { Rock } from "./rock";
import { Bush } from "./bush";
import { Player } from "./player";
import { center } from "./position";
import { PathFinder } from "./path-finder";

export class World extends THREE.Mesh {
  camera;
  terrain;
  #elements = new Map<string, Element>();
  width;
  height;
  path_finder;
  constructor(
    width: number,
    height: number,
    camera: THREE.Camera,
    tree_count: number,
    rock_count: number,
    bush_count: number,
  ) {
    super();
    this.width = width;
    this.height = height;
    this.camera = camera;
    this.terrain = this.make_terrain();
    this.path_finder = new PathFinder(this);
    this.make_grid();
    this.make_trees(tree_count);
    this.make_rocks(rock_count);
    this.make_bushes(bush_count);
    this.make_player();
    this.add(this.terrain);
  }
  serialize_coordinate(v: THREE.Vector3) {
    return `${v.x},${v.z}`;
  }
  get_random_position(): THREE.Vector3 {
    const x = Math.floor(Math.random() * this.width);
    const z = Math.floor(Math.random() * this.height);
    const next_position = center(new THREE.Vector3(x, 0, z));
    const existing_element = this.get_element(next_position);
    if (existing_element) {
      return this.get_random_position();
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
    const prev_rocks = this.terrain.getObjectByName("rocks");
    if (prev_rocks) {
      this.remove_object(prev_rocks, this.terrain);
    }
    const group = new THREE.Group();
    group.name = "rocks";
    for (let i = 0; i < count; i++) {
      const rock = new Rock(this);
      const serialized_coordinate = this.serialize_coordinate(rock.position);
      this.#elements.set(serialized_coordinate, rock);
      rock.name = `rock-${serialized_coordinate}`;
      group.add(rock);
    }
    this.terrain.map.add(group);
  }
  make_trees(count: number) {
    const prev_trees = this.terrain.getObjectByName("trees");
    if (prev_trees) {
      this.remove_object(prev_trees, this.terrain);
    }
    const group = new THREE.Group();
    group.name = "trees";
    for (let i = 0; i < count; i++) {
      const tree = new Tree(this);
      const serialized_coordinate = this.serialize_coordinate(tree.position);
      this.#elements.set(serialized_coordinate, tree);
      tree.name = `tree-${serialized_coordinate}`;
      group.add(tree);
    }
    this.terrain.map.add(group);
  }
  make_bushes(count: number) {
    const prev_bushes = this.terrain.getObjectByName("bushes");
    if (prev_bushes) {
      this.remove_object(prev_bushes, this.terrain);
    }
    const group = new THREE.Group();
    group.name = "bushes";
    for (let i = 0; i < count; i++) {
      const bush = new Bush(this);
      const serialized_coordinate = this.serialize_coordinate(bush.position);
      this.#elements.set(serialized_coordinate, bush);
      bush.name = `bush-${serialized_coordinate}`;
      group.add(bush);
    }
    this.terrain.map.add(group);
  }
  make_player() {
    const prev_players = this.terrain.getObjectByName("players");
    if (prev_players) {
      this.remove_object(prev_players, this.terrain);
    }
    const group = new THREE.Group();
    group.name = "players";
    const player = new Player(this);
    const random_position = this.get_random_position();
    const position = new THREE.Vector3(
      random_position.x,
      player.position.y,
      random_position.z,
    );
    player.position.copy(position);
    const serialized_coordinate = this.serialize_coordinate(position);
    this.#elements.set(serialized_coordinate, player);
    player.name = `player-${serialized_coordinate}`;
    group.add(player);
    this.terrain.map.add(group);
  }
  make_grid() {
    const size = this.width;
    const divisions = this.height;
    const grid_helper = new THREE.GridHelper(size, divisions);
    this.add(grid_helper);
  }
  get_element(position: THREE.Vector3) {
    const _position = new THREE.Vector3(position.x, position.y, position.z);
    const serialized = this.serialize_coordinate(_position);
    return this.#elements.get(serialized);
  }
  make_terrain() {
    const terrain = new Terrain(this);
    this.add(terrain);
    return terrain;
  }
}
