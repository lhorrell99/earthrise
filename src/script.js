import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import earthVertex from "/shaders/earthVertex.glsl";
import earthFragment from "/shaders/earthFragment.glsl";

/* 
ThreeJS spherical coord system:
  radius - the radius, or the Euclidean distance (straight-line distance) from the point to the origin
  phi - polar angle in radians from the y (up) axis
  theta - equator angle in radians around the y (up) axis

Positioning assumptions
  moon radius is 1/4 EARTHRADIUS (approx correct)
  moon (and camera) positioned around 10 * earth radius from earth location (correct value 60 * EARTHRADIUS)

Params TODO
  parameterise everything based on EARTHRADIUS
  ensure everything is in radians
*/

const degToRad = (x) => x * params.utils.degToRad;

const EARTHRADIUS = 5;

const params = {
  utils: {
    axesHelperSize: 10,
    degToRad: Math.PI / 180,
  },
  camera: {
    fov: 20,
    nearDist: 0.01,
    farDist: 1000,
    moonRelCoords: {
      x: 0,
      y: (EARTHRADIUS / 4) * 1.01,
      z: 0,
    },
    moonPhi: - Math.PI / 75,
  },
  earth: {
    sphereRadius: EARTHRADIUS,
    heightSegments: 64,
    widthSegments: 64,
    cartCoords: {
      x: 0,
      y: 0,
      z: 0,
    },
  },
  moon: {
    sphereRadius: EARTHRADIUS / 4,
    heightSegments: 256,
    widthSegments: 256,
    cartCoords: {
      x: 0,
      y: 0,
      z: 10 * EARTHRADIUS,
    },
    zRotation: Math.PI / 2,
  },
  lights: {
    ambLight: {
      intensity: 0.4,
      color: "#FFFFFF",
    },
    dirLight: {
      intensity: 5,
      color: "#FFFAED",
      spherCoords: {
        radius: 10 * EARTHRADIUS,
        phi: 10 * (Math.PI / 6),
        theta: 2 * (Math.PI / 6),
      },
    },
  },
};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// THREE.ColorManagement.enabled = false;

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

// *** Camera ***

// Setup camera pivot point at moon centre
const cameraPivot = new THREE.Group();

cameraPivot.position.set(
  params.moon.cartCoords.x,
  params.moon.cartCoords.y,
  params.moon.cartCoords.z
);

const camera = new THREE.PerspectiveCamera(
  params.camera.fov,
  sizes.width / sizes.height,
  params.camera.nearDist,
  params.camera.farDist
);

// Add to pivot group
cameraPivot.add(camera);

// Position camera (coordinates are relative to the group)
camera.position.set(
  params.camera.moonRelCoords.x,
  params.camera.moonRelCoords.y,
  params.camera.moonRelCoords.z
);

// Add camera to group
scene.add(cameraPivot);

// cameraPivot.rotateX(params.camera.moonPhi);
// cameraPivot.rotation.x += 0.00005;
cameraPivot.rotation.x += params.camera.moonPhi;
// camera.updateProjectionMatrix();
// renderer.render(scene, camera);

// *** Renderer ***

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

// *** Earth ***

// Geometry
const earthGeometry = new THREE.SphereGeometry(
  params.earth.sphereRadius,
  params.earth.widthSegments,
  params.earth.heightSegments
);

// Material
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

earthMaterial.defines = {};

earthMaterial.onBeforeCompile = (shader) => {
  // console.log(shader)

  shader.vertexShader = earthVertex;
  shader.fragmentShader = earthFragment;
};

// Mesh
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

earthMesh.position.set(
  params.earth.cartCoords.x,
  params.earth.cartCoords.y,
  params.earth.cartCoords.z
);

scene.add(earthMesh);

// *** Moon ***

// Geometry
const moonGeometry = new THREE.SphereGeometry(
  params.moon.sphereRadius,
  params.moon.widthSegments,
  params.moon.heightSegments
);

// Material
const moonTexture = textureLoader.load("/lroc_color_poles_1k.jpg");
moonTexture.magFilter = THREE.NearestFilter; // turn off texture pixel interpolation to review true pixellation extent
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });

// Mesh
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

moonMesh.position.set(
  params.moon.cartCoords.x,
  params.moon.cartCoords.y,
  params.moon.cartCoords.z
);

moonMesh.rotateZ(params.moon.zRotation);

scene.add(moonMesh);

// *** Lights ***

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
  params.lights.dirLight.spherCoords.radius,
  params.lights.dirLight.spherCoords.theta,
  params.lights.dirLight.spherCoords.phi
);

dirLight.target = earthMesh;

scene.add(dirLight);

// *** Helpers ***

// const axesHelper = new THREE.AxesHelper(params.utils.axesHelperSize);
// scene.add(axesHelper);

var stats = new Stats();
document.body.appendChild(stats.dom);

// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
// scene.add(dirLightHelper);

// *** Animate ***

const animate = function () {
  requestAnimationFrame(animate);

  stats.begin();

  renderer.render(scene, camera);
  earthMesh.rotation.y += 0.001;
  moonMesh.rotation.x += 0.00005;
  // cameraPivot.rotation.x += 0.00005;
  stats.end();
};

animate();
