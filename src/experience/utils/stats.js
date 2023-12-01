import StatsJS from "three/addons/libs/stats.module.js";

export default class Stats {
  constructor(_active) {
    this.instance = new StatsJS();
    // this.instance.showPanel(3);

    this.active = false;
    this.max = 40;
    this.ignoreMaxed = true;

    if (_active) {
      this.activate();
    }
  }

  activate() {
    this.active = true;
    document.body.appendChild(this.instance.dom);
  }

  deactivate() {
    this.active = false;
    document.body.removeChild(this.instance.dom);
  }

  update() {
    if (!this.active) return;
    this.instance.update();
  }
}
