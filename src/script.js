import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";

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

const EARTHRADIUS = 5

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
    radius: EARTHRADIUS*0.7,
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
};

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

// Helpers
// const axesHelper = new THREE.AxesHelper(params.utils.axesHelperSize);
// scene.add(axesHelper);

var stats = new Stats();
document.body.appendChild(stats.dom);

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

// Earth

const textureLoader = new THREE.TextureLoader();

const earthGeometry = new THREE.SphereGeometry(
  params.earth.sphereRadius,
  params.earth.widthSegments,
  params.earth.heightSegments
);

const earthTexture = textureLoader.load("/nasa-earth-topo-bathy-july-5400x2700.png");
// const earthTexture = textureLoader.load("/bluemarble-2048.png");
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });

const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
earthMesh.position.setFromSphericalCoords(
  params.earth.radius,
  degToRad(params.earth.phi),
  degToRad(params.earth.theta)
)


scene.add(earthMesh);

// Moon

const moonGeometry = new THREE.SphereGeometry(
  params.moon.sphereRadius,
  params.moon.widthSegments,
  params.moon.heightSegments
);

const moonTexture = textureLoader.load("/lroc_color_poles_1k.jpg");
moonTexture.magFilter = THREE.NearestFilter // turn off texture pixel interpolation to review true pixellation
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });

const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.setFromSphericalCoords(
  params.moon.radius,
  degToRad(params.moon.phi),
  degToRad(params.moon.theta)
)

moonMesh.rotateZ(degToRad(90))

scene.add(moonMesh);

const animate = function () {
  requestAnimationFrame(animate);

  stats.begin();

  renderer.render(scene, camera);
  earthMesh.rotation.y += 0.001;
  moonMesh.rotation.x += 0.00005;
  stats.end();
};

animate();
