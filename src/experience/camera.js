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
    this.setPosition();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      this.config.camera.fov,
      this.sizes.width / this.sizes.height,
      this.config.camera.nearDist,
      this.config.camera.farDist
    );

    // this.instance.position.set(0, 0, 50); // TODO: proper setup with group
  }

  setPosition() {
    this.group = new THREE.Group();

    // Position group (located at moon centre)
    this.group.position.set(
      this.config.geometries.moon.cartCoords.x,
      this.config.geometries.moon.cartCoords.y,
      this.config.geometries.moon.cartCoords.zRER * this.config.earthRadius
    );
    this.group.rotateX(this.config.camera.groupTransforms.xRotation);

    // Add instance
    this.group.add(this.instance);

    this.instance.position.set(
      this.config.camera.cartCoordsRMC.x,
      this.config.camera.cartCoordsRMC.yRER * this.config.earthRadius,
      this.config.camera.cartCoordsRMC.z
    );

    this.scene.add(this.group);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {}
}
