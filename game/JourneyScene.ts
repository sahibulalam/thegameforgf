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

  constructor() {
    super({ key: "JourneyScene" });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.reachedGirl = false;
    this.inputState = { left: false, right: false, jump: false };
    this.cameras.main.fadeIn(800, 0, 0, 0);

    this.bg1 = this.add.tileSprite(0, 0, width, height, "background")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setTint(0x1a1025);

    this.createStars(width, height);

    this.add.text(width * 0.5, 50, "The Journey", {
      fontSize: "28px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
    }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.9);

    // Flat ground - no jumping required, just walk
    this.platforms = this.physics.add.staticGroup();

    const groundY = height - 30;
    for (let x = -100; x < width * 2.5; x += 60) {
      const ground = this.platforms.create(x, groundY, "platform") as Phaser.Physics.Arcade.Sprite;
      ground.setScale(2).refreshBody();
    }

    // Player
    this.player = this.physics.add.sprite(50, height - 120, "player");
    this.player.setScale(1.2);

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setGravityY(400);
    playerBody.setBounce(0);
    playerBody.setCollideWorldBounds(false);
    playerBody.setSize(24, 40);

    // Girl at the end
    this.girl = this.physics.add.sprite(1600, height - 90, "girl");
    this.girl.setScale(1.3);
    this.girl.setTint(0xffc2d4);

    const girlBody = this.girl.body as Phaser.Physics.Arcade.Body;
    girlBody.setAllowGravity(false);
    girlBody.setImmovable(true);

    // Girl floating animation
    this.tweens.add({
      targets: this.girl,
      y: this.girl.y - 8,
      duration: 1200,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });

    // Arrow pointing to girl
    const arrow = this.add.text(1500, height - 150, "→", {
      fontSize: "40px",
      color: "#ffc2d4",
    }).setOrigin(0.5);

    this.tweens.add({
      targets: arrow,
      x: arrow.x + 20,
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
    this.cameras.main.setBounds(0, 0, width * 2, height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.physics.world.setBounds(0, 0, width * 2, height + 100);

    // Instruction
    const text = this.add.text(width / 2, 100, "Walk to her... →", {
      fontSize: "20px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
    }).setOrigin(0.5).setScrollFactor(0);

    this.tweens.add({
      targets: text,
      alpha: 0,
      delay: 3000,
      duration: 1000,
    });
  }

  private createStars(width: number, height: number) {
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, width * 2);
      const y = Phaser.Math.Between(0, height * 0.5);
      const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff, 0.7);

      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: Phaser.Math.Between(1500, 2500),
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

    // Walk to her smoothly
    this.tweens.add({
      targets: this.player,
      x: this.girl.x - 40,
      y: this.girl.y,
      duration: 600,
      ease: "Power2",
    });

    // Show heart between them
    this.time.delayedCall(800, () => {
      const heart = this.add.text(
        (this.player.x + this.girl.x) / 2,
        this.girl.y - 50,
        "❤️",
        { fontSize: "32px" }
      ).setOrigin(0.5);

      this.tweens.add({
        targets: heart,
        scale: 1.3,
        duration: 400,
        yoyo: true,
        repeat: 2,
      });
    });

    this.time.delayedCall(1500, () => {
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

    if (this.player.y > this.scale.height + 50) {
      this.player.setPosition(50, this.scale.height - 120);
      body.setVelocity(0, 0);
    }

    const onGround = body.blocked.down || body.touching.down;
    const moveSpeed = 280;
    const jumpPower = -400;

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
