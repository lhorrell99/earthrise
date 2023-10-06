import * as THREE from "three";
import vertexShader from "/shaders/vertex.glsl";
import fragmentShader from "/shaders/fragment.glsl";
// import { Pane } from "tweakpane";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/nasa-earth-topo-bathy-july-5400x2700.png");

const earthGeometry = new THREE.SphereGeometry(5, 64, 64);

const earthMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    globeTexture: {
      value: texture
    }
  }
});

const sphereMesh = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(sphereMesh);

const animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};

animate();

// ************** D1 **************

// // *** Settings ***

// const sizes = {
//   // Store viewport sizes (for updating camera on resize)
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// THREE.ColorManagement.enabled = false; // review this (And look at color spaces more widely)

// // *** Resources ***

// const textureURL = "/lroc_color_poles_1k.jpg";
// const displacementURL = "/ldem_3_8bit.jpg";
// const earthTextureURL = "/lroc_color_poles_1k.jpg";
// const earthDisplacementURL = "/ldem_3_8bit.jpg";

// // *** GUI parameters ***

// const PARAMS = {
//   cameraFOV: 75,
//   cameraX: 0,
//   cameraY: 0,
//   cameraZ: 5,
// };

// // *** Canvas ***

// const canvas = document.querySelector("canvas.webgl");

// // *** Scene ***

// const scene = new THREE.Scene();

// // *** Textures ***

// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(textureURL);
// const displacementMap = textureLoader.load(displacementURL);

// const moonMaterial = new THREE.MeshPhongMaterial({
//   color: 0xffffff,
//   map: texture,
//   displacementMap: displacementMap, // TODO figure out error
//   displacementScale: 0.06,
//   bumpMap: displacementMap,
//   bumpScale: 0.04,
//   reflectivity: 0,
//   shininess: 0,
// });

// // *** Geometries ***

// const sphereGeometry = new THREE.SphereGeometry(
//   2, // radius
//   64, // widthSegments, longitude (meridian)
//   64 // heightSegments, latitude (equator)
// );

// const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
// scene.add(moonMesh);

// // *** Lights ***

// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(-100, 10, 50);
// scene.add(light);

// const ambiLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambiLight);

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
// hemiLight.color.setHSL(0.6, 1, 0.6);
// hemiLight.groundColor.setHSL(0.095, 1, 0.75);
// hemiLight.position.set(0, 0, 0);
// scene.add(hemiLight);

// // *** Camera ***

// const camera = new THREE.PerspectiveCamera(
//   PARAMS.cameraFOV, // FOV
//   sizes.width / sizes.height, // Aspect ratio
//   0.1, // Near distance (nearest visible object - leave fixed unless issues)
//   100 // Far distance (furthest visible object - leave fixed unless issues)
// );

// camera.position.x = PARAMS.cameraX;
// camera.position.y = PARAMS.cameraY;
// camera.position.z = PARAMS.cameraZ;
// scene.add(camera);

// // *** Resizing ***

// window.addEventListener("resize", () => {
//   // Update sizes
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   // Update camera
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   // Update renderer
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// // *** Controls ***

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// // *** Renderer ***

// const renderer = new THREE.WebGLRenderer({
// antialias: true,
//   canvas: canvas,
// });

// renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // TODO, why the option for 2?

// // *** Dev Utils ***

// const axesHelper = new THREE.AxesHelper(10); // red = x, green = y, blue = z
// scene.add(axesHelper);

// // Add GUI params
// const pane = new Pane({
//   title: "Params",
// });

// const cameraFolder = pane.addFolder({
//   expanded: true,
//   title: "Camera",
// });

// cameraFolder
//   .addBinding(PARAMS, "cameraFOV", {
//     min: 10,
//     max: 100,
//     step: 1,
//   })
//   .on("change", () => {
//     camera.fov = PARAMS.cameraFOV; // using a setter better but giving weird results
//     camera.updateProjectionMatrix();
//   });

// cameraFolder
//   .addBinding(PARAMS, "cameraX", {
//     min: -10,
//     max: 10,
//     step: 0.5,
//   })
//   .on("change", () => {
//     camera.position.x = PARAMS.cameraX;
//     camera.updateProjectionMatrix();
//   });

// cameraFolder
//   .addBinding(PARAMS, "cameraY", {
//     min: -10,
//     max: 10,
//     step: 0.5,
//   })
//   .on("change", () => {
//     camera.position.y = PARAMS.cameraY;
//     camera.updateProjectionMatrix();
//   });

// cameraFolder
//   .addBinding(PARAMS, "cameraZ", {
//     min: -10,
//     max: 10,
//     step: 0.5,
//   })
//   .on("change", () => {
//     camera.position.z = PARAMS.cameraZ;
//     camera.updateProjectionMatrix();
//   }); // TODO - DRY

// // *** Animation ***

// const clock = new THREE.Clock();

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   // Rotate moon
//   moonMesh.rotation.y += 0.002;

//   // // Update controls
//   // controls.update();

//   // Render
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// };

// tick();
