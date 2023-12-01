import * as THREE from "three";
import Experience from "../experience";
import DGI from "../geometries/dualGeodesicIcosahedron";

export default class Moon {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.cfg = this.experience.cfg;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
    this.setPosition();
  }

  setGeometry() {
    this.geometry = new DGI(
      null,
      this.resources.items.dGIVertices,
      this.resources.items.dGIFaces,
      this.cfg.geometries.moon.radiusRER * this.cfg.earthRadius
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
      this.cfg.geometries.moon.cCoords.x,
      this.cfg.geometries.moon.cCoords.y,
      this.cfg.geometries.moon.cCoords.zRER * this.cfg.earthRadius
    );
    this.group.rotateZ(this.cfg.geometries.moon.groupTransforms.zRotation);

    // Add meshes
    this.group.add(this.mesh);
    this.scene.add(this.group);
  }
}
