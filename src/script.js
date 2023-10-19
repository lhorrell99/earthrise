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
    fov: 25,
    nearDist: 0.01,
    farDist: 1000,
    cartCoords: {
      x: 0,
      y: (EARTHRADIUS / 4) * 1.01,
      z: EARTHRADIUS * 10
    }
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

const camera = new THREE.PerspectiveCamera(
  params.camera.fov,
  sizes.width / sizes.height,
  params.camera.nearDist,
  params.camera.farDist
);

// Position camera (TODO: elegant implementation of alpha angle)
camera.position.set(
  params.camera.cartCoords.x,
  params.camera.cartCoords.y,
  params.camera.cartCoords.z,
);

scene.add(camera);

// *** Renderer ***

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(sizes.width, sizes.height);

// *** Controls ***

const controls = new OrbitControls(camera, renderer.domElement);

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

earthMaterial.onBeforeCompile = (t) => {
  t.uniforms.shadowDist = { value: 1.5 * params.globeRadius };
  t.uniforms.highlightDist = { value: 5 };
  t.uniforms.shadowPoint = {
    value: new THREE.Vector3(
      0.7 * params.globeRadius,
      0.3 * -params.globeRadius,
      params.globeRadius
    ),
  };
  t.uniforms.highlightPoint = { value: new THREE.Vector3(1.5 * -params.globeRadius, 1.5 * -params.globeRadius, 0) };
  t.uniforms.frontPoint = { value: new THREE.Vector3(0, 0, params.globeRadius) };
  t.uniforms.highlightColor = { value: new THREE.Color("#517966") };
  t.uniforms.frontHighlightColor = { value: new THREE.Color("#27367D") };
  t.vertexShader = earthVertex
  t.fragmentShader = earthFragment
};

earthMaterial.defines = {
  USE_HIGHLIGHT: 1,
  USE_HIGHLIGHT_ALT: 1,
  USE_FRONT_HIGHLIGHT: 1,
  DITHERING: 1,
}

// earthMaterial.defines = {
//   // USE_TRANSMISSION: 1,
//   // USE_HIGHLIGHT: 1,
//   // USE_HIGHLIGHT_ALT: 1,
//   // USE_FRONT_HIGHLIGHT: 1,
//   // DITHERING: 1,
// };

// earthMaterial.onBeforeCompile = (shader) => {
//   // console.log(shader)

//   shader.vertexShader = earthVertex;
//   shader.fragmentShader = earthFragment;
// };

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

// scene.add(moonMesh);

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
  stats.end();
};

animate();
