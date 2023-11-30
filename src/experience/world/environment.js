import * as THREE from "three";
import Experience from "../experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.config = this.experience.config;

    this.setDirectionalLight();
    this.setAmbientLight();
    this.setRectAreaLight();
  }

  setDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight(
      this.config.environment.dirLight.color,
      this.config.environment.dirLight.intensity
    );

    this.directionalLight.position.setFromSphericalCoords(
      this.config.environment.dirLight.spherCoords.radius,
      this.config.environment.dirLight.spherCoords.phi,
      this.config.environment.dirLight.spherCoords.theta
    );

    this.directionalLightTarget = new THREE.Object3D();
    this.directionalLightTarget.position.set(
      this.config.geometries.earth.cartCoords.x,
      this.config.geometries.earth.cartCoords.y,
      this.config.geometries.earth.cartCoords.y
    );
    this.directionalLight.target = this.directionalLightTarget;
    this.scene.add(this.directionalLight);
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(
      this.config.environment.ambLight.color,
      this.config.environment.ambLight.intensity
    );

    this.scene.add(this.ambientLight);
  }

  setRectAreaLight() {
    this.rectAreaLight = new THREE.RectAreaLight(
      this.config.environment.rectAreaLight.color,
      this.config.environment.rectAreaLight.intensity,
      this.config.environment.rectAreaLight.width,
      this.config.environment.rectAreaLight.height
    );

    this.rectAreaLight.position.setFromSphericalCoords(
      this.config.environment.rectAreaLight.spherCoords.radiusRER * this.config.earthRadius,
      this.config.environment.rectAreaLight.spherCoords.phi,
      this.config.environment.rectAreaLight.spherCoords.theta,
    );

    this.rectAreaLight.lookAt(
      this.config.geometries.earth.cartCoords.x,
      this.config.geometries.earth.cartCoords.y,
      this.config.geometries.earth.cartCoords.z
    );

    this.scene.add(this.rectAreaLight);
  }
}
