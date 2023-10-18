import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import earthVertex from "/shaders/earthVertex.glsl";
import earthFragment from "/shaders/earthFragment.glsl";

// THREE.ColorManagement.enabled = false;

const canvas = document.querySelector("canvas.webgl");

/* 
ThreeJS spherical coord system

radius - the radius, or the Euclidean distance (straight-line distance) from the point to the origin
phi - polar angle in radians from the y (up) axis
theta - equator angle in radians around the y (up) axis
*/

/*
Positioning assumptions

moon radius is 1/4 EARTHRADIUS (approx correct)
moon (and camera) positioned around 10 * earth radius from earth location (correct value 60 * EARTHRADIUS)
*/

const degToRad = (x) => x * params.utils.degToRad;

const EARTHRADIUS = 5;

const params = {
  utils: {
    axesHelperSize: 10,
    degToRad: Math.PI / 180,
  },
  camera: {
    fov: 25, // default 75
    nearDist: 0.0001,
    farDist: 1000,
    radius: 10.05 * EARTHRADIUS,
    phi: 90,
    theta: 0,
    lookAt: new THREE.Vector3(0, 0, 0),
  },
  earth: {
    sphereRadius: EARTHRADIUS,
    heightSegments: 64,
    widthSegments: 64,
    radius: EARTHRADIUS * 0.7,
    // radius: 0,
    phi: 0,
    theta: 0,
  },
  moon: {
    sphereRadius: EARTHRADIUS / 4,
    heightSegments: 256,
    widthSegments: 256,
    radius: 10 * EARTHRADIUS,
    phi: 91.46,
    theta: 0,
  },
  lights: {
    ambLight: {
      intensity: 0.4,
      color: "#FFFFFF",
    },
    dirLight: {
      intensity: 5,
      color: "#FFFAED",
      radius: 50, // TODO make everything parameterised on the globe radius
      phi: 300, // TODO switch to radians
      theta: 60,
    },
  },
};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  params.camera.fov,
  sizes.width / sizes.height,
  params.camera.nearDist,
  params.camera.farDist
);

camera.position.setFromSphericalCoords(
  params.camera.radius,
  degToRad(params.camera.phi),
  degToRad(params.camera.theta)
);
camera.lookAt(params.camera.lookAt);

scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

// Controls (temporary)
const controls = new OrbitControls(camera, renderer.domElement);

// Earth
const textureLoader = new THREE.TextureLoader();

const earthGeometry = new THREE.SphereGeometry(
  params.earth.sphereRadius,
  params.earth.widthSegments,
  params.earth.heightSegments
);

const earthTexture = textureLoader.load(
  "/nasa-earth-topo-bathy-july-5400x2700.png"
  // "/land-shallow-topo-2048.jpeg"
  // "/opencv-draft-2023-10-17.png"
);

const earthMaterial = new THREE.MeshPhysicalMaterial({
  map: earthTexture,
  metalness: 0,
  roughness: 0.8,
});

earthMaterial.defines = {
  // USE_TRANSMISSION: 1,
  // USE_HIGHLIGHT: 1,
  // USE_HIGHLIGHT_ALT: 1,
  // USE_FRONT_HIGHLIGHT: 1,
  // DITHERING: 1,
};

earthMaterial.onBeforeCompile = (shader) => {
  // console.log(shader)

  shader.vertexShader = earthVertex;
  shader.fragmentShader = earthFragment;
};

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.setFromSphericalCoords(
  params.earth.radius,
  degToRad(params.earth.phi),
  degToRad(params.earth.theta)
);

scene.add(earthMesh);

// Moon
const moonGeometry = new THREE.SphereGeometry(
  params.moon.sphereRadius,
  params.moon.widthSegments,
  params.moon.heightSegments
);

const moonTexture = textureLoader.load("/lroc_color_poles_1k.jpg");
moonTexture.magFilter = THREE.NearestFilter; // turn off texture pixel interpolation to review true pixellation
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.setFromSphericalCoords(
  params.moon.radius,
  degToRad(params.moon.phi),
  degToRad(params.moon.theta)
);

moonMesh.rotateZ(degToRad(90));

scene.add(moonMesh);

// Lights
const ambLight = new THREE.AmbientLight(
  params.lights.ambLight.color,
  params.lights.ambLight.intensity
);
scene.add(ambLight);

const dirLight = new THREE.DirectionalLight(
  params.lights.dirLight.color,
  params.lights.dirLight.intensity
);
dirLight.position.setFromSphericalCoords(
  params.lights.dirLight.radius,
  degToRad(params.lights.dirLight.theta),
  degToRad(params.lights.dirLight.phi)
);
dirLight.target = earthMesh;

scene.add(dirLight);

// Helpers

// const axesHelper = new THREE.AxesHelper(params.utils.axesHelperSize);
// scene.add(axesHelper);

var stats = new Stats();
document.body.appendChild(stats.dom);

// const helper = new THREE.DirectionalLightHelper(dirLight, 5);
// scene.add(helper);

// Animate
const animate = function () {
  requestAnimationFrame(animate);

  stats.begin();

  renderer.render(scene, camera);
  earthMesh.rotation.y += 0.001;
  moonMesh.rotation.x += 0.00005;
  stats.end();
};

animate();
