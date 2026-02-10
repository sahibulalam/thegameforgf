import * as Phaser from "phaser";

export class DistanceScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private hearts!: Phaser.Physics.Arcade.Group;
  private portal!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private heartsCollected: number = 0;
  private messageTexts: string[] = [
    "Do you remember my first message to you?",
    "I'm a happy man when I talk to you",
    "You liking this game still haha",
  ];
  private inputState = { left: false, right: false, jump: false };
  private bg1!: Phaser.GameObjects.TileSprite;
  private playerName!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "DistanceScene" });
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Platforms at 40% from top - CENTER of screen
    const platformY = height * 0.55;
    const playerStartY = platformY - 60;

    this.heartsCollected = 0;
    this.inputState = { left: false, right: false, jump: false };

    // Background
    this.bg1 = this.add.tileSprite(0, 0, width, height, "background")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setTint(0x1a1a2e);

    this.createStars(width, height);

    // Floating platforms - CENTER of screen
    this.platforms = this.physics.add.staticGroup();

    const platformPositions = [
      { x: 80, y: platformY },
      { x: 280, y: platformY - 20 },
      { x: 480, y: platformY + 15 },
      { x: 680, y: platformY - 25 },
      { x: 880, y: platformY + 10 },
      { x: 1080, y: platformY - 15 },
      { x: 1280, y: platformY },
    ];

    platformPositions.forEach((pos) => {
      this.createFloatingPlatform(pos.x, pos.y, 2.5);
    });

    // Player setup
    this.player = this.physics.add.sprite(100, playerStartY, "player");
    this.player.setScale(1.4);

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setGravityY(500);
    playerBody.setBounce(0);
    playerBody.setCollideWorldBounds(false);
    playerBody.setSize(24, 40);

    // Player name "Debs" floating above
    this.playerName = this.add.text(this.player.x, this.player.y - 55, "Debs", {
      fontSize: "18px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
      fontStyle: "bold",
    }).setOrigin(0.5);

    // Hearts floating above platforms
    this.hearts = this.physics.add.group({ allowGravity: false });

    const heartPositions = [
      { x: 300, y: platformY - 70 },
      { x: 700, y: platformY - 80 },
      { x: 1100, y: platformY - 65 },
    ];

    heartPositions.forEach((pos) => {
      const heart = this.hearts.create(pos.x, pos.y, "heart") as Phaser.Physics.Arcade.Sprite;
      heart.setScale(1.3);

      this.tweens.add({
        targets: heart,
        y: pos.y - 15,
        duration: 1200,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });

      this.tweens.add({
        targets: heart,
        alpha: { from: 0.7, to: 1 },
        duration: 800,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    });

    // Portal at end
    this.portal = this.add.sprite(1400, platformY - 40, "heart");
    this.portal.setScale(2.8);
    this.portal.setVisible(false);
    this.portal.setTint(0x00ffff);
    this.physics.add.existing(this.portal, true);

    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.hearts, this.collectHeart, undefined, this);
    this.physics.add.overlap(this.player, this.portal, this.enterPortal, undefined, this);

    // Keyboard
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // Camera setup - follow player in center
    this.cameras.main.setBounds(0, 0, 1600, height);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(width * 0.15, height * 0.2);
    this.physics.world.setBounds(0, 0, 1600, height + 300);

    // Instructions at top
    const text = this.add.text(width / 2, height * 0.1, "Collect the hearts ❤️", {
      fontSize: Math.min(26, width * 0.04) + "px",
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
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, 1600);
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

  private collectHeart(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    heart: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    const heartSprite = heart as Phaser.Physics.Arcade.Sprite;
    heartSprite.disableBody(true, true);

    const message = this.messageTexts[this.heartsCollected];

    const fontSize = Math.min(22, this.scale.width * 0.035);
    const text = this.add.text(this.scale.width / 2, this.scale.height * 0.2, message, {
      fontSize: fontSize + "px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
      align: "center",
      backgroundColor: "#000000cc",
      padding: { x: 20, y: 12 },
    }).setOrigin(0.5).setScrollFactor(0);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 30,
      duration: 3500,
      ease: "Power2",
      onComplete: () => text.destroy(),
    });

    this.heartsCollected++;

    if (this.heartsCollected >= 3) {
      this.portal.setVisible(true);

      const portalText = this.add.text(this.portal.x, this.portal.y - 80, "Enter! →", {
        fontSize: "22px",
        color: "#00ffff",
        fontFamily: "Georgia",
      }).setOrigin(0.5);

      this.tweens.add({
        targets: this.portal,
        alpha: { from: 0.7, to: 1 },
        scaleX: { from: 2.5, to: 3 },
        scaleY: { from: 2.5, to: 3 },
        duration: 600,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });

      this.tweens.add({
        targets: portalText,
        y: portalText.y - 10,
        duration: 800,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private enterPortal() {
    if (this.heartsCollected >= 3) {
      this.input.enabled = false;
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("JourneyScene");
      });
    }
  }

  handleInput(action: string, pressed: boolean) {
    this.inputState[action as keyof typeof this.inputState] = pressed;
  }

  update() {
    if (!this.player || !this.player.body) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const height = this.scale.height;

    // Reset if fallen
    if (this.player.y > height + 150) {
      const platformY = height * 0.55;
      this.player.setPosition(100, platformY - 60);
      body.setVelocity(0, 0);
    }

    // Update name position
    if (this.playerName) {
      this.playerName.setPosition(this.player.x, this.player.y - 55);
    }

    const onGround = body.blocked.down || body.touching.down;
    const moveSpeed = 250;
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
      this.bg1.tilePositionX = this.cameras.main.scrollX * 0.1;
    }
  }
}
