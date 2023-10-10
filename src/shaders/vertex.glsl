varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
    // Function main runs once for every vertex and sets its position
    // The position is defined as x, y, z, w (w is a translate/transform value which can typically be set to 1)
    // Defaults are passed to the shader as in here: https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram    
    vertexUV = uv;
    // Ensure the vertex normals are processed correctly
    vertexNormal = normalize(normalMatrix * normal);

    // Use the defaults passed to a shader by ThreeJS to calculate its position on screen
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
