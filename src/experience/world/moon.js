import * as THREE from "three";
import Experience from "../experience";
import DGI from "../geometries/dualGeodesicIcosahedron";

export default class Moon {
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
    this.geometry = new DGI(
      this.config.geometries.moon.radiusRER * this.config.earthRadius
    );
  }

  setTextures() {}

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x00ff00, // TODO remove
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  setPosition() {
    this.group = new THREE.Group();

    // Position group
    this.group.position.set(
      this.config.geometries.moon.cartCoords.x,
      this.config.geometries.moon.cartCoords.y,
      this.config.geometries.moon.cartCoords.zRER * this.config.earthRadius
    );
    this.group.rotateZ(this.config.geometries.moon.groupTransforms.zRotation);

    // Add meshes
    this.group.add(this.mesh);
    this.scene.add(this.group);
  }
}
