/*
Note: 
  RER = relative to earth radius
  RMC = relative to moon centre
*/

export default {
  earthRadius: 5, // Separated for convience (used to parameterise scene)
  utils: {
    axesHelperSize: 10,
  },
  camera: {
    fov: 20,
    nearDist: 0.01,
    farDist: 1000,
    cCoordsRMC: {
      x: 0,
      yRER: 1.01 / 4,
      z: 0,
    },
    groupTransforms: {
      xRotation: -Math.PI / 75,
    },
  },
  geometries: {
    earth: {
      cCoords: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    atmo: {
      radiusRER: 1.1,
      hSegs: 32,
      wSegs: 32
    },
    moon: {
      radiusRER: 0.25,
      cCoords: {
        x: 0,
        y: 0,
        zRER: 10,
      },
      groupTransforms: {
        zRotation: Math.PI / 2,
      },
    },
  },
  env: {
    dirLight: {
      color: "#FFFAED",
      intensity: 3,
      sCoords: {
        radiusRER: 10,
        phi: 2 * (Math.PI / 6),
        theta: 10 * (Math.PI / 6),
      },
    },
    ambLight: {
      color: "#FFFFFF",
      intensity: 0.6,
    },
    rectAreaLight: {
      color: "#F5DCC9", 
      intensity: 9, 
      width: 1.5, 
      height: 5,
      sCoords: {
        radiusRER: 1.3,
        phi: Math.PI / 2,
        theta: (22.5 / 12) * Math.PI,
      }
    },
  },
};
