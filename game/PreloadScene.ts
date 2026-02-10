import * as Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    this.createPlaceholderGraphics();
  }

  private createPlaceholderGraphics() {
    // Player - Cute smiley face
    const playerGraphics = this.make.graphics({ x: 0, y: 0 });
    // Face circle
    playerGraphics.fillStyle(0xffdb58); // Yellow
    playerGraphics.fillCircle(24, 24, 22);
    // Rosy cheeks
    playerGraphics.fillStyle(0xffb6c1);
    playerGraphics.fillCircle(12, 28, 5);
    playerGraphics.fillCircle(36, 28, 5);
    // Eyes
    playerGraphics.fillStyle(0x000000);
    playerGraphics.fillCircle(16, 20, 4);
    playerGraphics.fillCircle(32, 20, 4);
    // Eye shine
    playerGraphics.fillStyle(0xffffff);
    playerGraphics.fillCircle(17, 19, 2);
    playerGraphics.fillCircle(33, 19, 2);
    // Cute smile
    playerGraphics.lineStyle(3, 0x000000);
    playerGraphics.beginPath();
    playerGraphics.arc(24, 26, 10, 0.2, Math.PI - 0.2, false);
    playerGraphics.strokePath();
    playerGraphics.generateTexture("player", 48, 48);
    playerGraphics.destroy();

    // Girl - Cute smiley with heart
    const girlGraphics = this.make.graphics({ x: 0, y: 0 });
    // Face circle
    girlGraphics.fillStyle(0xffdb58);
    girlGraphics.fillCircle(24, 24, 22);
    // Rosy cheeks
    girlGraphics.fillStyle(0xffb6c1);
    girlGraphics.fillCircle(12, 28, 6);
    girlGraphics.fillCircle(36, 28, 6);
    // Eyes with lashes
    girlGraphics.fillStyle(0x000000);
    girlGraphics.fillCircle(16, 20, 4);
    girlGraphics.fillCircle(32, 20, 4);
    // Eye shine
    girlGraphics.fillStyle(0xffffff);
    girlGraphics.fillCircle(17, 19, 2);
    girlGraphics.fillCircle(33, 19, 2);
    // Cute smile
    girlGraphics.lineStyle(3, 0x000000);
    girlGraphics.beginPath();
    girlGraphics.arc(24, 26, 10, 0.2, Math.PI - 0.2, false);
    girlGraphics.strokePath();
    // Little bow/heart on top
    girlGraphics.fillStyle(0xff6b9d);
    girlGraphics.fillCircle(20, 4, 5);
    girlGraphics.fillCircle(28, 4, 5);
    girlGraphics.fillTriangle(15, 6, 33, 6, 24, 16);
    girlGraphics.generateTexture("girl", 48, 48);
    girlGraphics.destroy();

    // Heart
    const heartGraphics = this.make.graphics({ x: 0, y: 0 });
    heartGraphics.fillStyle(0xff6b9d);
    heartGraphics.fillCircle(10, 10, 10);
    heartGraphics.fillCircle(22, 10, 10);
    heartGraphics.fillTriangle(0, 12, 32, 12, 16, 32);
    heartGraphics.generateTexture("heart", 32, 32);
    heartGraphics.destroy();

    // Platform - cloud-like
    const platformGraphics = this.make.graphics({ x: 0, y: 0 });
    platformGraphics.fillStyle(0x4a4a6a);
    platformGraphics.fillRoundedRect(0, 4, 64, 12, 6);
    platformGraphics.fillStyle(0x5a5a7a);
    platformGraphics.fillRoundedRect(2, 2, 60, 8, 4);
    platformGraphics.generateTexture("platform", 64, 16);
    platformGraphics.destroy();

    // Background
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
