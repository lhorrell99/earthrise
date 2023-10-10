import * as THREE from "three";
import vertexShader from "/shaders/vertex.glsl";
import fragmentShader from "/shaders/fragment.glsl";
import atmoVertexShader from "/shaders/atmoVertex.glsl";
import atmoFragmentShader from "/shaders/atmoFragment.glsl";
import gsap from "gsap";

// THREE.ColorManagement.enabled = false;

const canvas = document.querySelector("canvas.webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 15;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

// Earth

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/nasa-earth-topo-bathy-july-5400x2700.png");

const earthGeometry = new THREE.SphereGeometry(5, 64, 64);

// const earthMaterial = new THREE.MeshBasicMaterial({ map: texture });

const earthMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  // uniforms: properties passed to a shader from JS
  uniforms: {
    globeTexture: {
      value: texture,
    },
  },
});

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earthMesh);

earthMesh.rotation.y = -0.2

// Atmosphere

const atmoGeometry = new THREE.SphereGeometry(5, 64, 64);

const atmoMaterial = new THREE.ShaderMaterial({
  vertexShader: atmoVertexShader,
  fragmentShader: atmoFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
});

const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);

atmoMesh.scale.set(1.1, 1.1, 1.1);
scene.add(atmoMesh);

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // earthMesh.rotation.y += 0.001;
};

animate();
