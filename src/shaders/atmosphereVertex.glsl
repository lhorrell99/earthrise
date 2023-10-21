varying vec3 vertexNormal;

void main() {
    // Ensure the vertex normals are processed correctly
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}