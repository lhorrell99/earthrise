import * as THREE from "three";
import faces from "./dualGeodesicIcosahedronFaces.json"; // TODO should these be in static? loaded by asset loader?
import vertices from "./dualGeodesicIcosahedronVertices.json";

export default class DGI extends THREE.PolyhedronGeometry {
  constructor(radius = 1) {
    const triangularFaces = [];

    faces.forEach((face) => {
      const principleVertex = face.shift();
      // Select all pairs of remaining vertices
      face.forEach((v, i, arr) => {
        if (i < arr.length - 1) {
          triangularFaces.push(principleVertex, v, arr[i + 1]);
        }
      });
    });

    super(vertices, triangularFaces, radius);

    this.hexagonalFaces = faces;
  }
}
