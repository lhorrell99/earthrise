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
    cartCoordsRMC: {
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
      widthSegments: 64,
      heightSegments: 64,
      cartCoords: {
        x: 0,
        y: 0,
        z: 0,
      },
    },
    moon: {
      radiusRER: 0.25,
      widthSegments: 256,
      heightSegments: 256,
      cartCoords: {
        x: 0,
        y: 0,
        zRER: 10,
      },
      groupTransforms: {
        zRotation: Math.PI / 2,
      },
    },
  },
  environment: {},
};
