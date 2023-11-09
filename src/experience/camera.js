import * as THREE from "three";
import Experience from "./experience";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.config = this.experience.config;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      this.config.camera.fov,
      this.sizes.width / this.sizes.height,
      this.config.camera.nearDist,
      this.config.camera.farDist
    );

    
    this.instance.position.set(0, 0, 50); // TODO: proper setup with group
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {}
}
