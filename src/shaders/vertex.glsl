// main runs once for every vertex

varying vec2 vertexUV;

void main() {
    // for every vertex, set the position (x y z (w is translate/transform - can always be set to 1))
    // threeJS passes the vertex position by default as a vector three called position https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram
    
    vertexUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
