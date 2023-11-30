import * as THREE from "three";
import DGI from "../geometries/dualGeodesicIcosahedron";
import Experience from "../experience";

export default class Earth {
  constructor() {
    this.experience = new Experience();
    this.cfg = this.experience.cfg;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
    this.setPosition();
  }

  setGeometry() {
    this.geometry = new DGI(this.cfg.earthRadius);
  }

  setTextures() {}

  setMaterial() {
    // this.material = new THREE.MeshBasicMaterial({
    //   wireframe: true,
    //   color: 0xff0000, // TODO remove
    // });

    this.material = new THREE.MeshPhysicalMaterial({
      color: "#000154",
      // map: earthTexture,
      metalness: 0,
      roughness: 0.8,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  setPosition() {
    this.group = new THREE.Group();

    // Position group
    this.group.position.set(
      this.cfg.geometries.earth.cCoords.x,
      this.cfg.geometries.earth.cCoords.y,
      this.cfg.geometries.earth.cCoords.z
    );

    // Add meshes
    this.group.add(this.mesh);
    this.scene.add(this.group);
  }
}
