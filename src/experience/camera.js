import * as THREE from "three";
import Experience from "./experience";

export default class Camera {
  constructor() {
    this.experience = new Experience();

    this.canvas = this.experience.canvas;
    this.cfg = this.experience.cfg;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;

    this.setInstance();
    this.setPosition();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      this.cfg.camera.fov,
      this.sizes.width / this.sizes.height,
      this.cfg.camera.nearDist,
      this.cfg.camera.farDist
    );
  }

  setPosition() {
    this.group = new THREE.Group();

    // Position group (located at moon centre)
    this.group.position.set(
      this.cfg.geometries.moon.cCoords.x,
      this.cfg.geometries.moon.cCoords.y,
      this.cfg.geometries.moon.cCoords.zRER * this.cfg.earthRadius
    );
    this.group.rotateX(this.cfg.camera.groupTransforms.xRotation);

    // Add instance
    this.group.add(this.instance);

    this.instance.position.set(
      this.cfg.camera.cCoordsRMC.x,
      this.cfg.camera.cCoordsRMC.yRER * this.cfg.earthRadius,
      this.cfg.camera.cCoordsRMC.z
    );

    this.scene.add(this.group);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {}
}
