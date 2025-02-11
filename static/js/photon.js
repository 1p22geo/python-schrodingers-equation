import { PARTICLES } from "./constants.js";

export class Photon {
  constructor(sigma, kx0, ky0, x0, y0, vx, vy) {
    this.sigma = sigma;
    this.kx0 = kx0;
    this.ky0 = ky0;
    this.x0 = x0;
    this.y0 = y0;
    this.vx = vx;
    this.vy = vy;

    this.text = "PHOTON";
    this.__type = PARTICLES.PHOTON;
    this.__style = ["bg-yellow-300", "bg-[url('./media/png/icons/photon_smol.jpg')]", "image-bg"];
  }
  serialize() {
    return {
      type: PARTICLES.PHOTON,
      sigma: this.sigma,
      kx0: this.kx0,
      ky0: this.ky0,
      x0: this.x0,
      y0: this.y0,
      vx: this.vx,
      vy: this.vy,
    };
  }
}
