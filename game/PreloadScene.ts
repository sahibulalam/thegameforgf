import * as Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.createPlaceholderGraphics();
  }

  private createPlaceholderGraphics() {
    const playerGraphics = this.make.graphics({ x: 0, y: 0 });
    playerGraphics.fillStyle(0xff6b9d);
    playerGraphics.fillRoundedRect(0, 0, 32, 48, 8);
    playerGraphics.fillStyle(0xffc2d4);
    playerGraphics.fillCircle(16, 12, 10);
    playerGraphics.generateTexture("player", 32, 48);
    playerGraphics.destroy();

    const girlGraphics = this.make.graphics({ x: 0, y: 0 });
    girlGraphics.fillStyle(0xffc2d4);
    girlGraphics.fillRoundedRect(0, 0, 32, 48, 8);
    girlGraphics.fillStyle(0xffb3c6);
    girlGraphics.fillCircle(16, 12, 10);
    girlGraphics.fillStyle(0xff8fab);
    girlGraphics.fillTriangle(8, 48, 24, 48, 16, 60);
    girlGraphics.generateTexture("girl", 32, 64);
    girlGraphics.destroy();

    const heartGraphics = this.make.graphics({ x: 0, y: 0 });
    heartGraphics.fillStyle(0xff6b9d);
    heartGraphics.fillCircle(10, 10, 10);
    heartGraphics.fillCircle(22, 10, 10);
    heartGraphics.fillTriangle(0, 12, 32, 12, 16, 32);
    heartGraphics.generateTexture("heart", 32, 32);
    heartGraphics.destroy();

    const platformGraphics = this.make.graphics({ x: 0, y: 0 });
    platformGraphics.fillStyle(0x2a2a3e);
    platformGraphics.fillRoundedRect(0, 0, 64, 16, 4);
    platformGraphics.fillStyle(0x3a3a4e);
    platformGraphics.fillRoundedRect(2, 2, 60, 6, 2);
    platformGraphics.generateTexture("platform", 64, 16);
    platformGraphics.destroy();

    const bgGraphics = this.make.graphics({ x: 0, y: 0 });
    bgGraphics.fillStyle(0x0a0a14);
    bgGraphics.fillRect(0, 0, 800, 600);
    bgGraphics.generateTexture("background", 800, 600);
    bgGraphics.destroy();
  }

  create() {
    this.scene.start("DistanceScene");
  }
}
