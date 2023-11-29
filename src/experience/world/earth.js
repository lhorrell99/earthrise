import * as THREE from "three";
import Experience from "../experience";
import DualGeodesicIcosahedron from "../geometries/dualGeodesicIcosahedron";

export default class Earth {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.config = this.experience.config;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
    this.setPosition();
  }

  setGeometry() {
    const dGI = new DualGeodesicIcosahedron(this.config.earthRadius)
    this.geometry = dGI.getGeometry();
  }

  setTextures() {}

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xff0000, // TODO remove
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  setPosition() {
    this.group = new THREE.Group();

    // Position group
    this.group.position.set(
      this.config.geometries.earth.cartCoords.x,
      this.config.geometries.earth.cartCoords.y,
      this.config.geometries.earth.cartCoords.z
    );

    // Add meshes
    this.group.add(this.mesh);
    this.scene.add(this.group);
  }
}
