import * as THREE from "three";
import Camera from "./camera";
import Renderer from "./renderer";
import Sizes from "./utils/sizes";
import Time from "./utils/time";
import World from "./world/world";
import Resources from "./utils/resources.js";

import assets from "./assets.js";
import config from "./config.js";

export default class Experience {
  static instance;

  constructor(canvas) {
    // Configure singleton (enables dependency injection on other classes)
    if (Experience.instance) {
      return Experience.instance;
    }

    Experience.instance = this;

    // Options
    this.canvas = canvas;

    // Save data
    this.assets = assets;
    this.config = config;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.resources = new Resources();
    this.renderer = new Renderer();
    this.world = new World();

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    // Centralised function allows control of the order of resize events (e.g. to ensure camera is moved before next render)
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
  }
}
