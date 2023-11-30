import * as THREE from "three";
import Experience from "../experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.cfg = this.experience.cfg;
    this.scene = this.experience.scene;

    this.setDirectionalLight();
    this.setAmbientLight();
    this.setRectAreaLight();
  }

  setDirectionalLight() {
    // Init directional light
    this.directionalLight = new THREE.DirectionalLight(
      this.cfg.env.dirLight.color,
      this.cfg.env.dirLight.intensity
    );

    // Set light position
    this.directionalLight.position.setFromSphericalCoords(
      this.cfg.env.dirLight.sCoords.radius,
      this.cfg.env.dirLight.sCoords.phi,
      this.cfg.env.dirLight.sCoords.theta
    );

    // Define target position
    this.directionalLightTarget = new THREE.Object3D(); // TODO is this the cleanest strategy? (2023-30-11 I think probably)
    this.directionalLightTarget.position.set(
      this.cfg.geometries.earth.cCoords.x,
      this.cfg.geometries.earth.cCoords.y,
      this.cfg.geometries.earth.cCoords.y
    );
    this.directionalLight.target = this.directionalLightTarget;

    // Add to scene
    this.scene.add(this.directionalLight);
  }

  setAmbientLight() {
    // Init light
    this.ambientLight = new THREE.AmbientLight(
      this.cfg.env.ambLight.color,
      this.cfg.env.ambLight.intensity
    );

    // Add to scene
    this.scene.add(this.ambientLight);
  }

  setRectAreaLight() {
    // Init light
    this.rectAreaLight = new THREE.RectAreaLight(
      this.cfg.env.rectAreaLight.color,
      this.cfg.env.rectAreaLight.intensity,
      this.cfg.env.rectAreaLight.width,
      this.cfg.env.rectAreaLight.height
    );

    // Set light position
    this.rectAreaLight.position.setFromSphericalCoords(
      this.cfg.env.rectAreaLight.sCoords.radiusRER * this.cfg.earthRadius,
      this.cfg.env.rectAreaLight.sCoords.phi,
      this.cfg.env.rectAreaLight.sCoords.theta
    );

    // Define target position
    this.rectAreaLight.lookAt(
      this.cfg.geometries.earth.cCoords.x,
      this.cfg.geometries.earth.cCoords.y,
      this.cfg.geometries.earth.cCoords.z
    );

    // Add to scene
    this.scene.add(this.rectAreaLight);
  }
}
