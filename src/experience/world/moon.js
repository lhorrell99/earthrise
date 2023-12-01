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
      this.resources.items.nasaMoonImage,
      this.resources.items.dGIVertices,
      this.resources.items.dGIFaces,
      this.cfg.geometries.moon.radiusRER * this.cfg.earthRadius
    );
  }

  setTextures() {}

  setMaterial() {
    this.material = new THREE.MeshPhysicalMaterial({
      metalness: 0,
      roughness: 0.8,
      vertexColors: true,
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

  update() {
    this.group.rotation.x += 0.0001;
  }
}
