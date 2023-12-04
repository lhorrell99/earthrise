import * as THREE from "three";
import Experience from "../experience";
import atmosphereMaterial from "../materials/atmosphere";

export default class Atmosphere {
  constructor() {
    this.experience = new Experience();
    this.cfg = this.experience.cfg;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setPosition();
  }

  setGeometry() {
    this.geometry = new THREE.SphereGeometry(
      this.cfg.geometries.atmo.radiusRER * this.cfg.earthRadius,
      this.cfg.geometries.atmo.wSegs,
      this.cfg.geometries.atmo.hSegs
    );
  }

  setMaterial() {
    this.material = atmosphereMaterial();
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  setPosition() {
    // Position mesh
    this.mesh.position.set(
      this.cfg.geometries.earth.cCoords.x,
      this.cfg.geometries.earth.cCoords.y,
      this.cfg.geometries.earth.cCoords.z
    );

    // Add mesh
    this.scene.add(this.mesh);
  }

  update() {}
}
