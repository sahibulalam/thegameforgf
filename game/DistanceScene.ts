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

    this.heartsCollected = 0;
    this.inputState = { left: false, right: false, jump: false };

    this.bg1 = this.add.tileSprite(0, 0, width, height, "background")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setTint(0x1a1a2e);

    this.createStars(width, height);

    this.platforms = this.physics.add.staticGroup();

    const groundY = height - 30;
    for (let x = -100; x < width * 3; x += 60) {
      const ground = this.platforms.create(x, groundY, "platform") as Phaser.Physics.Arcade.Sprite;
      ground.setScale(2).refreshBody();
    }

    // Player setup
    this.player = this.physics.add.sprite(80, height - 120, "player");
    this.player.setScale(1.2);

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setGravityY(400);
    playerBody.setBounce(0);
    playerBody.setCollideWorldBounds(false);
    playerBody.setSize(24, 40);

    // Player name "Debs" floating above
    this.playerName = this.add.text(this.player.x, this.player.y - 45, "Debs", {
      fontSize: "14px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
    }).setOrigin(0.5);

    // Hearts on ground level
    this.hearts = this.physics.add.group({ allowGravity: false });

    const heartPositions = [
      { x: 350, y: height - 100 },
      { x: 700, y: height - 100 },
      { x: 1050, y: height - 100 },
    ];

    heartPositions.forEach((pos) => {
      const heart = this.hearts.create(pos.x, pos.y, "heart") as Phaser.Physics.Arcade.Sprite;
      heart.setScale(1);

      this.tweens.add({
        targets: heart,
        y: pos.y - 10,
        duration: 1000,
        ease: "Sine.easeInOut",
        yoyo: true,
        repeat: -1,
      });
    });

    // Portal
    this.portal = this.add.sprite(1400, height - 100, "heart");
    this.portal.setScale(2.5);
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

    // Camera - fixed to follow player properly
    this.cameras.main.setBounds(0, 0, 1600, height);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setDeadzone(100, 50);
    this.physics.world.setBounds(0, 0, 1600, height + 100);

    // Instructions
    const text = this.add.text(width / 2, 40, "Collect the hearts ❤️", {
      fontSize: "18px",
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
    for (let i = 0; i < 40; i++) {
      const x = Phaser.Math.Between(0, 1600);
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

  private collectHeart(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    heart: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ) {
    const heartSprite = heart as Phaser.Physics.Arcade.Sprite;
    heartSprite.disableBody(true, true);

    const message = this.messageTexts[this.heartsCollected];

    // Show message in center of screen
    const text = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, message, {
      fontSize: "20px",
      color: "#ffc2d4",
      fontFamily: "Georgia",
      align: "center",
      backgroundColor: "#00000088",
      padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setScrollFactor(0);

    this.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 30,
      duration: 3000,
      ease: "Power2",
      onComplete: () => text.destroy(),
    });

    this.heartsCollected++;

    if (this.heartsCollected >= 3) {
      this.portal.setVisible(true);

      const portalText = this.add.text(this.portal.x, this.portal.y - 70, "Enter! →", {
        fontSize: "18px",
        color: "#00ffff",
        fontFamily: "Georgia",
      }).setOrigin(0.5);

      this.tweens.add({
        targets: this.portal,
        alpha: { from: 0.7, to: 1 },
        scaleX: { from: 2.3, to: 2.7 },
        scaleY: { from: 2.3, to: 2.7 },
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

    // Reset if fallen
    if (this.player.y > this.scale.height + 50) {
      this.player.setPosition(80, this.scale.height - 120);
      body.setVelocity(0, 0);
    }

    // Update name position
    if (this.playerName) {
      this.playerName.setPosition(this.player.x, this.player.y - 45);
    }

    const onGround = body.blocked.down || body.touching.down;
    const moveSpeed = 220;
    const jumpPower = -380;

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
