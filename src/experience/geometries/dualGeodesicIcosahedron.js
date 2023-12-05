// TODO refactor as function (probably cleaner)

import * as THREE from "three";

export default class DGI {
  constructor(colorMap, vertices, faces, radius = 1) {
    this.colorMap = colorMap;
    this.vertices = vertices;
    this.faces = faces;
    this.radius = radius;

    this.getImageCanvas();
    this.getTriFaces();
    this.getColors();

    const geometry = new THREE.PolyhedronGeometry(
      this.vertices,
      this.triFaces,
      this.radius
    );

    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(this.colors, 3)
    );

    return geometry;
  }

  getImageCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.colorMap.width;
    this.canvas.height = this.colorMap.height;
    this.context = this.canvas.getContext("2d", { willReadFrequently: true });
    this.context.drawImage(
      this.colorMap,
      0,
      0,
      this.colorMap.width,
      this.colorMap.height
    );
  }

  getTriFaces() {
    this.triFaces = [];

    this.faces.forEach((face) => {
      const principleVertex = face[0];

      for (let i = 1; i < face.length - 1; i++) {
        this.triFaces.push(principleVertex, face[i], face[i + 1]);
      }
    });
  }

  getColors() {
    this.colors = [];
    this.faces.forEach((face) => {
      const centroid = this.getCentroid(face);
      const latLon = this.getVertexLatLon(...centroid);
      const centroidColor = this.getColorAtPoint(...latLon);

      for (let i = 1; i < face.length - 1; i++) {
        this.colors.push(...centroidColor, ...centroidColor, ...centroidColor);
      }
    });

    // Rescale color values (currently 0-255, need to be 0-1)
    const maxVal = this.colors.reduce((a, b) => Math.max(a, b), 0);
    this.colors = this.colors.map((u) => u / maxVal);
  }

  getCentroid(face) {
    // Vertices contains continuous array of x y z coords
    const coords = [];
    face.forEach((vertex) => {
      coords.push([
        this.vertices[vertex * 3], // x
        this.vertices[vertex * 3 + 1], // y
        this.vertices[vertex * 3 + 2], // z
      ]);
    });

    // Sum all x, y and z components and average to get centroid
    return [
      coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length,
      coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length,
      coords.reduce((sum, coord) => sum + coord[2], 0) / coords.length,
    ];
  }

  getVertexLatLon(x, y, z) {
    const spherCoord = new THREE.Spherical();
    spherCoord.setFromCartesianCoords(x, y, z);

    const lat = Math.PI / 2 - spherCoord.phi;
    const lon = spherCoord.theta;
    return [lat, lon];
  }

  getColorAtPoint(lat, lon) {
    const x = Math.floor(
      ((lon + Math.PI) / (2 * Math.PI)) * (this.colorMap.width - 1) // - 1 to guarantee the point always falls inside the canvas
    );
    const y = Math.floor(
      ((Math.PI / 2 - lat) / Math.PI) * (this.colorMap.height - 1)
    );

    // Read the pixel color at from the Image
    const pixel = this.context.getImageData(x, y, 1, 1).data;

    // Return R, G, B (no A)
    return [pixel[0], pixel[1], pixel[2]];
  }
}
