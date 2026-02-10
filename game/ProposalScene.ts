import * as Phaser from "phaser";

export class ProposalScene extends Phaser.Scene {
  constructor() {
    super({ key: "ProposalScene" });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.cameras.main.fadeIn(1500, 0, 0, 0);

    const bg = this.add.rectangle(0, 0, width, height, 0x0a0a0f);
    bg.setOrigin(0, 0);

    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, width);
      const y = Phaser.Math.Between(0, height);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff, 0.6);

      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    }

    this.time.delayedCall(500, () => {
      if (this.game) {
        this.game.events.emit("proposal-trigger");
      }
    });
  }

  triggerCelebration() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.particles(0, 0, "heart", {
      x: { min: 0, max: width },
      y: -20,
      lifespan: 4000,
      speed: { min: 100, max: 200 },
      angle: { min: 80, max: 100 },
      scale: { start: 0.4, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [0xff6b9d, 0xff8fab, 0xffc2d4],
      quantity: 2,
      frequency: 100,
    });

    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 400, () => {
        this.createFirework(
          Phaser.Math.Between(width * 0.2, width * 0.8),
          Phaser.Math.Between(height * 0.2, height * 0.5)
        );
      });
    }
  }

  private createFirework(x: number, y: number) {
    const colors = [0xff6b9d, 0xff8fab, 0xffc2d4, 0xffffff];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = Phaser.Math.Between(100, 200);
      const color = colors[Math.floor(Math.random() * colors.length)];

      const particle = this.add.circle(x, y, 3, color);

      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * speed,
        y: y + Math.sin(angle) * speed,
        alpha: 0,
        scale: 0,
        duration: 1000,
        ease: "Power2",
        onComplete: () => particle.destroy(),
      });
    }
  }
}
