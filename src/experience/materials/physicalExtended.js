import * as THREE from "three";
import physicalExtendedMaterialVertex from "./shaders/physicalExtendedMaterialVertex.glsl";
import physicalExtendedMaterialFragment from "./shaders/physicalExtendedMaterialFragment.glsl";

export default function (fresnel) {
  const material = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0.8,
    vertexColors: true
  });

  if (fresnel) {
    material.defines = {
      FRESNEL_EFFECT: true,
    }
  }

  material.onBeforeCompile = (shader) => {
    shader.uniforms.highlightColor = { value: new THREE.Color("#4287f5") }; // TODO rename
    shader.uniforms.fresnelPower = { value: 7 }; // higher = lower power
  
    shader.vertexShader = physicalExtendedMaterialVertex;
    shader.fragmentShader = physicalExtendedMaterialFragment;
  };
  return material;
}
