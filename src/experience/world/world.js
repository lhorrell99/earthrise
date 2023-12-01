import * as THREE from "three";
import Experience from "../experience";
import Environment from "./environment";
import Earth from "./earth";
import Moon from "./moon";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment();
      this.earth = new Earth();
      this.moon = new Moon();
    });
  }

  update() {
    if (this.earth) this.earth.update();
    if (this.moon) this.moon.update();
  }
}
