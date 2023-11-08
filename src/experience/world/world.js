import * as THREE from "three";
import Experience from "../experience";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    const testMesh = new THREE.Mesh(
      new THREE.SphereGeometry(5, 32, 32),
      new THREE.MeshBasicMaterial({ wireframe: true })
    );

    this.scene.add(testMesh)
  }
}
