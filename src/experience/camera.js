import * as THREE from "three";
import Experience from "./experience.js";

export default class Camera {
  constructor(_options) {
    // Options
    this.experience = new Experience();
    this.config = this.experience.config;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.targetElement = this.experience.targetElement;
    this.scene = this.experience.scene;

    // Set up
    this.setInstance();
  }

  setInstance() {
    // Set up
    this.instance = new THREE.PerspectiveCamera(
      25,
      this.config.width / this.config.height,
      0.1,
      150
    );

    this.scene.add(this.instance);
  }

  resize() {
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.instance.updateMatrixWorld();
  }

  destroy() {}
}
