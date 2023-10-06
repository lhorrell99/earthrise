uniform sampler2D globeTexture;
varying vec2 vertexUV; // uv coordinates vec2(0, 0.24)

void main() {
    // rgba colours
    gl_FragColor = texture2D(globeTexture, vertexUV);
}