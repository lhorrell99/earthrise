import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import earthVertex from "/shaders/earthVertex.glsl";
import earthFragment from "/shaders/earthFragment.glsl";
import atmosphereVertex from "/shaders/atmosphereVertex.glsl";
import atmosphereFragment from "/shaders/atmosphereFragment.glsl";
import Hexasphere from "/hexasphere-src/hexasphere";

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
    moonPhi: -Math.PI / 75,
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
      intensity: 0.6,
      color: "#FFFFFF",
    },
    dirLight: {
      intensity: 3,
      color: "#FFFAED",
      spherCoords: {
        radius: 10 * EARTHRADIUS,
        phi: 2 * (Math.PI / 6),
        theta: 10 * (Math.PI / 6),
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

cameraPivot.rotation.x += params.camera.moonPhi;

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
  // "/plain-blue.png",
  "/nasa-earth-topo-bathy-july-5400x2700.png"
  // "/land-shallow-topo-2048.jpeg"
  // "/opencv-draft-2023-10-17.png"
);

const earthMaterial = new THREE.MeshPhysicalMaterial({
  color: "#000154",
  // map: earthTexture,
  metalness: 0,
  roughness: 0.8,
});

earthMaterial.defines = {
  FRESNEL_EFFECT: true,
};

earthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.highlightColor = { value: new THREE.Color("#4287f5") }; // TODO rename
  shader.uniforms.fresnelPower = { value: 7 }; // higher = lower power

  shader.vertexShader = earthVertex;
  shader.fragmentShader = earthFragment;
};

// // Mesh
const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

earthMesh.position.set(
  params.earth.cartCoords.x,
  params.earth.cartCoords.y,
  params.earth.cartCoords.z
);

const radius = 5; // Radius used to calculate position of tiles
const subDivisions = 5; // Divide each edge of the icosohedron into this many segments
const tileWidth = 0.9; // Add padding (1.0 = no padding; 0.1 = mostly padding)

const hexasphere = new Hexasphere(radius, subDivisions, tileWidth);

hexasphere.tiles.forEach((tile) => {
  const verticesList = [];

  tile.boundary.forEach((vertex) => {
    verticesList.push(vertex.x, vertex.y, vertex.z);
  });

  const vertices = new Float32Array(verticesList);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

  const mesh = new THREE.Mesh(geometry, earthMaterial);
  scene.add(mesh)
});

// *** Earth Clouds ***

// Geometry
const cloudGeometry = new THREE.SphereGeometry(
  params.earth.sphereRadius * 1.005,
  params.earth.widthSegments,
  params.earth.heightSegments
);

// Material
const cloudTexture = textureLoader.load("/cloud-combined-2048.jpeg");

const cloudMaterial = new THREE.MeshPhysicalMaterial({
  color: "#FFFFFF",
  metalness: 0,
  roughness: 0.8,
  alphaMap: cloudTexture,
  transparent: true,
});

// Mesh
const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

cloudMesh.position.set(
  params.earth.cartCoords.x,
  params.earth.cartCoords.y,
  params.earth.cartCoords.z
);

// scene.add(cloudMesh);

// *** Atmosphere ***

// Geometry
const atmoGeometry = new THREE.SphereGeometry(5, 64, 64);

// Material
const atmoMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertex,
  fragmentShader: atmosphereFragment,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
});

// Mesh
const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);

atmoMesh.scale.set(1.1, 1.1, 1.1);
// scene.add(atmoMesh);

// ******************

// *** Moon ***

// Geometry
const moonGeometry = new THREE.SphereGeometry(
  params.moon.sphereRadius,
  params.moon.widthSegments,
  params.moon.heightSegments
);

// Material
const moonTexture = textureLoader.load("/lroc-color-poles-1k.jpg");
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
  params.lights.dirLight.spherCoords.phi,
  params.lights.dirLight.spherCoords.theta
);

dirLight.target = earthMesh;

scene.add(dirLight);

const rectAreaLight = new THREE.RectAreaLight("#f5dcc9", 13, 1.5, 5);

rectAreaLight.position.setFromSphericalCoords(
  EARTHRADIUS * 1.3,
  Math.PI / 2,
  (22.5 / 12) * Math.PI
);

rectAreaLight.lookAt(0, 0, 0);

scene.add(rectAreaLight);

// const spotlightA = new THREE.SpotLight("#4287f5", 200, 100, (2/12) * Math.PI, 0.5, 1.1); // color, intensity, distance, angle, penumbra, decay
// spotlightA.position.setFromSphericalCoords(
//   5 * EARTHRADIUS,
//   (2/6) * Math.PI,
//   (8/6) * Math.PI
// );
// spotlightA.target = earthMesh;
// scene.add(spotlightA);

// *** Helpers ***

var stats = new Stats();
document.body.appendChild(stats.dom);

// const axesHelper = new THREE.AxesHelper(params.utils.axesHelperSize);
// scene.add(axesHelper);

// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
// scene.add(dirLightHelper);

// const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
// rectAreaLight.add(rectAreaLightHelper);

// const spotlightHelper = new THREE.SpotLightHelper(spotlightA);
// scene.add(spotlightHelper);

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
