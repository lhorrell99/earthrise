import * as THREE from "three";
import DGI from "../geometries/dualGeodesicIcosahedron";
import Experience from "../experience";
import physicalExtendedMaterial from "../materials/physicalExtended"

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
    this.geometry = new DGI(
      this.resources.items.earthTopoBathyImage,
      this.resources.items.dGIVertices,
      this.resources.items.dGIFaces,
      this.cfg.earthRadius
    );
  }

  setTextures() {}

  setMaterial() {
    this.material = physicalExtendedMaterial(true)
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  setPosition() {
    // TODO is group needed?
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

  update() {
    this.group.rotation.y += 0.001
  }
}
