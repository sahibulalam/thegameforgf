import * as Phaser from "phaser";

export class JourneyScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private girl!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private inputState = { left: false, right: false, jump: false };
  private reachedGirl: boolean = false;
  private bg1!: Phaser.GameObjects.TileSprite;
  private playerName!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "JourneyScene" });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Platforms at 40% from top - CENTER of screen
    const platformY = height * 0.55;
    const playerStartY = platformY - 60;

    this.reachedGirl = false;
    this.inputState = { left: false, right: false, jump: false };
    this.cameras.main.fadeIn(800, 0, 0, 0);

    // Background
    this.bg1 = this.add.tileSprite(0, 0, width, height, "background")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setTint(0x1a1025);

    this.createStars(width, height);

    // Title at top
    const titleSize = Math.min(30, width * 0.05);
    this.add.text(width * 0.5, height * 0.08, "The Journey", {
      fontSize: titleSize + "px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
    }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.9);

    // Floating platforms - CENTER of screen
    this.platforms = this.physics.add.staticGroup();

    const platformPositions = [
      { x: 80, y: platformY },
      { x: 280, y: platformY - 15 },
      { x: 480, y: platformY + 20 },
      { x: 680, y: platformY - 20 },
      { x: 880, y: platformY + 10 },
      { x: 1080, y: platformY - 10 },
    ];

    platformPositions.forEach((pos) => {
      this.createFloatingPlatform(pos.x, pos.y, 2.5);
    });

    // Player
    this.player = this.physics.add.sprite(80, playerStartY, "player");
    this.player.setScale(1.4);

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setGravityY(500);
    playerBody.setBounce(0);
    playerBody.setCollideWorldBounds(false);
    playerBody.setSize(24, 40);

    // Player name
    this.playerName = this.add.text(this.player.x, this.player.y - 55, "Debs", {
      fontSize: "18px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Girl platform and girl
    this.createFloatingPlatform(1200, platformY, 3);

    this.girl = this.physics.add.sprite(1200, platformY - 60, "girl");
    this.girl.setScale(1.5);
    this.girl.setTint(0xffc2d4);

    const girlBody = this.girl.body as Phaser.Physics.Arcade.Body;
    girlBody.setAllowGravity(false);
    girlBody.setImmovable(true);

    // Heart above girl
    const girlHeart = this.add.text(this.girl.x, this.girl.y - 60, "♥", {
      fontSize: "24px",
      color: "#ff6b9d",
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [this.girl, girlHeart],
      y: "-=10",
      duration: 1500,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    this.tweens.add({
      targets: this.girl,
      alpha: { from: 0.85, to: 1 },
      duration: 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Arrow
    const arrow = this.add.text(1050, platformY - 70, "→", {
      fontSize: "40px",
      color: "#ffc2d4",
    }).setOrigin(0.5);

    this.tweens.add({
      targets: arrow,
      x: arrow.x + 25,
      duration: 600,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.girl, this.meetGirl, undefined, this);

    // Keyboard
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Camera
    this.cameras.main.setBounds(0, 0, 1350, height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(width * 0.15, height * 0.2);
    this.physics.world.setBounds(0, 0, 1350, height + 300);

    // Instruction
    const instrSize = Math.min(22, width * 0.04);
    const text = this.add.text(width / 2, height * 0.18, "Walk to him... →", {
      fontSize: instrSize + "px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
    }).setOrigin(0.5).setScrollFactor(0);

    this.tweens.add({
      targets: text,
      alpha: 0,
      delay: 2500,
      duration: 1000,
    });
  }

  private createFloatingPlatform(x: number, y: number, scaleX: number) {
    const platform = this.platforms.create(x, y, "platform") as Phaser.Physics.Arcade.Sprite;
    platform.setScale(scaleX, 1.3).refreshBody();

    this.tweens.add({
      targets: platform,
      y: y - 6,
      duration: 2000 + Math.random() * 1000,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  private createStars(width: number, height: number) {
    for (let i = 0; i < 70; i++) {
      const x = Phaser.Math.Between(0, 1350);
      const y = Phaser.Math.Between(0, height);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 3), 0xffffff, 0.8);

      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1500, 3000),
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private meetGirl() {
    if (this.reachedGirl) return;
    this.reachedGirl = true;

    this.input.enabled = false;

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setVelocity(0, 0);
    playerBody.setAllowGravity(false);

    this.tweens.add({
      targets: this.player,
      x: this.girl.x - 50,
      y: this.girl.y,
      duration: 700,
      ease: "Power2",
    });

    this.tweens.add({
      targets: this.playerName,
      alpha: 0,
      duration: 300,
    });

    // Hearts animation
    this.time.delayedCall(800, () => {
      for (let i = 0; i < 5; i++) {
        const heart = this.add.text(
          (this.player.x + this.girl.x) / 2 + (Math.random() - 0.5) * 40,
          this.girl.y - 30 - (i * 20),
          "❤️",
          { fontSize: "22px" }
        ).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
          targets: heart,
          alpha: 1,
          y: heart.y - 30,
          duration: 600,
          delay: i * 150,
          ease: "Back.easeOut",
        });
      }
    });

    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("ProposalScene");
      });
    });
  }

  handleInput(action: string, pressed: boolean) {
    this.inputState[action as keyof typeof this.inputState] = pressed;
  }

  update() {
    if (!this.player || !this.player.body || this.reachedGirl) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const height = this.scale.height;

    // Reset if fallen
    if (this.player.y > height + 150) {
      const platformY = height * 0.55;
      this.player.setPosition(80, platformY - 60);
      body.setVelocity(0, 0);
    }

    // Update name position
    if (this.playerName) {
      this.playerName.setPosition(this.player.x, this.player.y - 55);
    }

    const onGround = body.blocked.down || body.touching.down;
    const moveSpeed = 270;
    const jumpPower = -520;

    let moveLeft = this.inputState.left;
    let moveRight = this.inputState.right;
    let wantJump = this.inputState.jump;

    if (this.cursors) {
      moveLeft = moveLeft || this.cursors.left.isDown;
      moveRight = moveRight || this.cursors.right.isDown;
      wantJump = wantJump || this.cursors.up.isDown;
    }
    if (this.spaceKey) {
      wantJump = wantJump || this.spaceKey.isDown;
    }

    if (moveLeft) {
      body.setVelocityX(-moveSpeed);
      this.player.setFlipX(true);
    } else if (moveRight) {
      body.setVelocityX(moveSpeed);
      this.player.setFlipX(false);
    } else {
      body.setVelocityX(0);
    }

    if (wantJump && onGround) {
      body.setVelocityY(jumpPower);
    }

    if (this.bg1) {
      this.bg1.tilePositionX = this.cameras.main.scrollX * 0.15;
    }
  }
}
