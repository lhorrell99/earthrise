import * as THREE from "three";
import faces from "./dualGeodesicIcosahedronFaces.json"; // TODO should these be in static? loaded by asset loader?
import vertices from "./dualGeodesicIcosahedronVertices.json";

export default class DualGeodesicIcosahedron {
  constructor(radius = 1) {
    this.faces = faces;
    this.vertices = vertices;

    this.generateTriangularFaces();

    this.geometry = new THREE.PolyhedronGeometry(
      this.vertices,
      this.triangularFaces,
      radius
    );
  }

  generateTriangularFaces() {
    this.triangularFaces = [];

    this.faces.forEach((face) => {
      const principleVertex = face.shift();
      // Select all pairs of remaining vertices
      face.forEach((v, i, arr) => {
        if (i < arr.length - 1) {
          this.triangularFaces.push(principleVertex, v, arr[i + 1]);
        }
      });
    });
  }

  getGeometry() {
    return this.geometry;
  }
}
