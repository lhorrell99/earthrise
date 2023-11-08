import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./eventEmitter.js";
import Experience from "../experience.js";

export default class Resources extends EventEmitter {
  constructor() {
    super();

    this.experience = new Experience();
    console.log(this.experience)
    this.assets = this.experience.assets;

    this.items = {};
    this.toLoad = this.assets.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.textureLoader = new THREE.TextureLoader();
  }

  startLoading() {
    // Load each asset
    for (const asset of this.assets) {
      if (asset.type === "texture") {
        this.loaders.textureLoader.load(asset.path, (file) => {
          this.assetLoaded(asset, file);
        });
      }
    }
  }

  assetLoaded(asset, file) {
    this.items[asset.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}