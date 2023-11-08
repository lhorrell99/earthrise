import * as THREE from "three";
import Experience from "../experience";
import Environment from "./environment";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment();
    });
  }
}
