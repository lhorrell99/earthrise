import * as THREE from "three";
import Experience from "./experience";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      20,
      this.sizes.width / this.sizes.height,
      0.01,
      1000
    );

    this.instance.position.set(0, 0, 50); // TODO: proper setup with group
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {}
}
