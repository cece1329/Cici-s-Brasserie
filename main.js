// --- FULL RESTORATION VERSION (FIXED PRELOAD ERROR) ---
// Fitur: Layout Auto-Fit Full Screen (ENVELOP), Deteksi Dapur Ketat, Sistem Shop, Menu, Animasi, dan Gameplay.

class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        const { width, height } = this.scale;
        const loadingText = this.add.text(width / 2, height / 2, "Mempersiapkan Kafe Cici... 0%", { fontSize: '32px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.load.on('progress', (v) => loadingText.setText(`Mempersiapkan Kafe Cici... ${Math.floor(v * 100)}%`));
        this.load.on('complete', () => loadingText.destroy());

        // Assets
        this.load.spritesheet('amelia_idle', 'asetgamepjbl/barista/Amelia_idle_anim_16x16.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('amelia_run', 'asetgamepjbl/barista/Amelia_run_16x16.png', { frameWidth: 16, frameHeight: 32 });
        
        ['adam', 'alex', 'bob'].forEach(name => {
            const path = `asetgamepjbl/pelanggan/${name.charAt(0).toUpperCase() + name.slice(1)}/`;
            const base = name.charAt(0).toUpperCase() + name.slice(1);
            // FIX: Tanda petik di akhir fungsi .png' sudah diperbaiki menjadi .png)
            this.load.spritesheet(`${name}_idle`, `${path}${base}_idle_anim_16x16.png`, { frameWidth: 16, frameHeight: 32 });
            this.load.spritesheet(`${name}_run`, `${path}${base}_run_16x16.png`, { frameWidth: 16, frameHeight: 32 });
            this.load.spritesheet(`${name}_sit`, `${path}${base}_sit_16x16.png`, { frameWidth: 32, frameHeight: 32 });
        });
        
        this.load.image('bubble_pesan', 'asetgamepjbl/bubblechatpesan.png');
        this.load.image('proses', 'asetgamepjbl/proses.png');
        this.load.image('indoor', 'asetgamepjbl/indoor.png');
        this.load.image('food_burger', 'asetgamepjbl/Pixel Art Food Pack/Burger.png');
        this.load.image('food_coffee', 'asetgamepjbl/Pixel Art Food Pack/Cup of coffee.png');
        this.load.image('food_croissant', 'asetgamepjbl/Pixel Art Food Pack/Croissant.png');
        this.load.image('food_cake', 'asetgamepjbl/Pixel Art Food Pack/Strawberry cake.png');
        this.load.image('plate', 'asetgamepjbl/Plate.png');
        this.load.spritesheet('coin', 'asetgamepjbl/coin.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('shine', 'asetgamepjbl/shine.png', { frameWidth: 16, frameHeight: 32 });
    }

    create() {
        // --- ANIMATIONS ---
        this.anims.create({ key: 'run_right', frames: this.anims.generateFrameNumbers('amelia_run', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run_up', frames: this.anims.generateFrameNumbers('amelia_run', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run_left', frames: this.anims.generateFrameNumbers('amelia_run', { start: 12, end: 17 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run_down', frames: this.anims.generateFrameNumbers('amelia_run', { start: 18, end: 23 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'idle_down', frames: this.anims.generateFrameNumbers('amelia_idle', { start: 18, end: 23 }), frameRate: 6, repeat: -1 });
        ['adam', 'alex', 'bob'].forEach(name => {
            this.anims.create({ key: `${name}_run_up`, frames: this.anims.generateFrameNumbers(`${name}_run`, { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: `${name}_run_down`, frames: this.anims.generateFrameNumbers(`${name}_run`, { start: 18, end: 23 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: `${name}_sit`, frames: this.anims.generateFrameNumbers(`${name}_sit`, { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
        });
        this.anims.create({ key: 'coin_anim', frames: this.anims.generateFrameNumbers('coin'), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'shine_anim', frames: this.anims.generateFrameNumbers('shine'), frameRate: 8, repeat: -1 });

        // --- MAP & PHYSICS ---
        const { width, height } = this.scale;
        const MAP_W = 1402; const MAP_H = 1122;
        
        this.add.image(0, 0, 'indoor').setOrigin(0, 0).setDisplaySize(MAP_W, MAP_H);
        this.physics.world.setBounds(0, 0, MAP_W, MAP_H);

        this.walls = this.physics.add.staticGroup();
        const addWall = (x, y, w, h) => {
            const r = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0xff0000, 0);
            this.physics.add.existing(r, true);
            this.walls.add(r);
        };
        addWall(0, 0, MAP_W, 20); addWall(0, MAP_H - 20, MAP_W, 20); addWall(0, 0, 20, MAP_H); addWall(MAP_W - 20, 0, 20, MAP_H);
        addWall(100, 380, 550, 80); addWall(648, 88, 40, 300); addWall(100, 0, 550, 260);

        // --- STATS ---
        this.coins = 0; this.level = 1; this.exp = 0; this.expToNextLevel = 50;
        this.baseSpeed = 250;
        this.foodPrices = { 'food_coffee': 5, 'food_burger': 10, 'food_croissant': 15, 'food_cake': 30 };
        this.foodOptions = ['food_coffee'];
        this.hasFood = false; this.isCooking = false;

        this.allChairs = [
            { x: 115, y: 480, isOccupied: false, minLevel: 1 },
            { x: 330, y: 480, isOccupied: false, minLevel: 1 },
            { x: 355, y: 750, isOccupied: false, minLevel: 2 },
            { x: 215, y: 630, isOccupied: false, minLevel: 3 },
            { x: 775, y: 700, isOccupied: false, minLevel: 4 }
        ];

        // --- PLAYER ---
        this.player = this.physics.add.sprite(300, 320, 'amelia_idle').setScale(4.5);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(8, 6).setOffset(4, 26);
        this.player.setDepth(100);
        this.player.play('idle_down');
        this.physics.add.collider(this.player, this.walls);

        // --- CAMERA SYSTEM ---
        this.cameras.main.setBounds(0, 0, MAP_W, MAP_H);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

        this.cursors = this.input.keyboard.addKeys('W,A,S,D');

        // --- UI HUD ---
        this.add.rectangle(0, 0, width, 70, 0x3e2723, 0.9).setOrigin(0).setScrollFactor(0).setDepth(1000);
        this.coinText = this.add.text(20, 10, `💰 Coins: 0`, { fontSize: '22px', fill: '#ffd54f', fontStyle: 'bold' }).setScrollFactor(0).setDepth(1001);
        this.levelText = this.add.text(width - 150, 10, `⭐ Level: 1`, { fontSize: '22px', fill: '#fff', fontStyle: 'bold' }).setScrollFactor(0).setDepth(1001);
        this.expBar = this.add.rectangle(width - 150, 45, 0, 10, 0x4caf50).setOrigin(0).setScrollFactor(0).setDepth(1002);

        this.shopBtn = this.add.text(width/2 - 80, 35, "🛒 SHOP", { fontSize: '18px', backgroundColor: '#4e342e', padding: 8 }).setOrigin(0.5).setInteractive().setScrollFactor(0).setDepth(1001);
        this.menuBtn = this.add.text(width/2 + 80, 35, "📋 MENU", { fontSize: '18px', backgroundColor: '#4e342e', padding: 8 }).setOrigin(0.5).setInteractive().setScrollFactor(0).setDepth(1001);

        // --- SHOP & MENU PANELS ---
        this.shopElements = [];
        const createShop = () => {
            const shopBg = this.add.rectangle(width / 2, height / 2, 450, 450, 0x3e2723).setStrokeStyle(4, 0x795548).setScrollFactor(0).setDepth(2000).setVisible(false);
            const shopTitle = this.add.text(width / 2, height / 2 - 190, "UPGRADE MENU", { fontSize: '32px', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(2001).setVisible(false);
            const addItem = (foodKey, cost, reqLevel, yOffset) => {
                const bg = this.add.rectangle(width / 2, height / 2 + yOffset, 400, 70, 0x4e342e).setInteractive().setScrollFactor(0).setDepth(2001).setVisible(false);
                const icon = this.add.image(width / 2 - 160, height / 2 + yOffset, foodKey).setScale(2).setScrollFactor(0).setDepth(2002).setVisible(false);
                const name = foodKey.split('_')[1].toUpperCase();
                const text = this.add.text(width / 2 - 120, height / 2 + yOffset, `Unlock ${name} (${cost} Coins)\n[REQ LEVEL ${reqLevel}]`, { fontSize: '14px' }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(2002).setVisible(false);
                this.shopElements.push(bg, icon, text);
                bg.on('pointerdown', () => {
                    if (this.coins >= cost && this.level >= reqLevel && !this.foodOptions.includes(foodKey)) {
                        this.coins -= cost; this.foodOptions.push(foodKey); this.updateUI();
                        text.setText(`${name} UNLOCKED!`); bg.setFillStyle(0x2e7d32);
                    }
                });
            };
            addItem('food_burger', 30, 2, -100);
            addItem('food_croissant', 60, 3, -20);
            addItem('food_cake', 100, 5, 60);
            const closeBtn = this.add.text(width/2, height/2 + 180, " [ CLOSE ] ", { fontSize: '24px', backgroundColor: '#ff5252', padding: 10 }).setOrigin(0.5).setInteractive().setScrollFactor(0).setDepth(2002).setVisible(false);
            this.shopElements.push(shopBg, shopTitle, closeBtn);
            closeBtn.on('pointerdown', () => this.shopElements.forEach(el => el.setVisible(false)));
        };
        createShop();

        this.menuElements = [];
        const createMenuPanel = () => {
            const menuBg = this.add.rectangle(width / 2, height / 2, 500, 400, 0x2d1b18).setStrokeStyle(4, 0x8d6e63).setScrollFactor(0).setDepth(2000).setVisible(false);
            const menuTitle = this.add.text(width / 2, height / 2 - 160, "OUR MENU", { fontSize: '32px', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setDepth(2001).setVisible(false);
            const closeMenuBtn = this.add.text(width / 2, height / 2 + 160, " [ BACK ] ", { fontSize: '24px', backgroundColor: '#5d4037', padding: 8 }).setOrigin(0.5).setInteractive().setScrollFactor(0).setDepth(2001).setVisible(false);
            this.menuElements = [menuBg, menuTitle, closeMenuBtn];
            this.menuBtn.on('pointerdown', () => {
                this.shopElements.forEach(el => el.setVisible(false));
                this.menuElements.forEach(el => { if (el.isFoodItem) el.destroy(); });
                this.menuElements = this.menuElements.filter(el => !el.isFoodItem);
                this.menuElements.forEach(el => el.setVisible(true));
                this.foodOptions.forEach((food, index) => {
                    const y = height / 2 - 80 + (index * 60);
                    const icon = this.add.image(width / 2 - 180, y, food).setScale(2).setScrollFactor(0).setDepth(2002);
                    const text = this.add.text(width / 2 - 140, y, `${food.split('_')[1].toUpperCase()} - 💰${this.foodPrices[food]}`, { fontSize: '20px' }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(2002);
                    icon.isFoodItem = true; text.isFoodItem = true; this.menuElements.push(icon, text);
                });
            });
            closeMenuBtn.on('pointerdown', () => this.menuElements.forEach(el => el.setVisible(false)));
        };
        createMenuPanel();

        this.shopBtn.on('pointerdown', () => { this.menuElements.forEach(el => el.setVisible(false)); this.shopElements.forEach(el => el.setVisible(true)); });

        // --- GAMEPLAY ELEMENTS ---
        this.customerGroup = this.physics.add.group();
        this.cookBtn = this.add.text(width / 2, height - 60, "🍳 MASAK 🍳", { fontSize: '28px', backgroundColor: '#8d6e63', padding: 15 }).setOrigin(0.5).setInteractive().setVisible(false).setDepth(500).setScrollFactor(0);
        this.prosesImg = this.add.image(width / 2, height - 60, 'proses').setScale(0.6).setVisible(false).setDepth(500).setScrollFactor(0);
        this.heldContainer = this.add.container(0, 0).setVisible(false).setDepth(150);
        this.heldContainer.add([this.add.image(0, 8, 'plate').setScale(3), this.heldFoodImg = this.add.image(0, -8, 'food_coffee').setScale(1.5)]);
        
        this.cookBtn.on('pointerdown', () => this.startCooking());
        this.time.addEvent({ delay: 10000, callback: () => this.spawnCustomer(), loop: true });
        this.spawnCustomer();
        
        this.moneyGroup = this.physics.add.group();
        this.physics.add.overlap(this.player, this.moneyGroup, (p, m) => {
            this.coins += m.coinValue; this.gainExp(20); this.updateUI(); m.destroy();
        }, null, this);

        this.kitchenZone = { x: 670, y: 460 };
        this.doorPos = { x: 690, y: 1070 };
    }

    update() {
        let isMoving = false; let direction = 'down'; this.player.setVelocity(0);
        if (this.cursors.A.isDown) { this.player.setVelocityX(-this.baseSpeed); direction = 'left'; isMoving = true; }
        else if (this.cursors.D.isDown) { this.player.setVelocityX(this.baseSpeed); direction = 'right'; isMoving = true; }
        if (this.cursors.W.isDown) { this.player.setVelocityY(-this.baseSpeed); direction = 'up'; isMoving = true; }
        else if (this.cursors.S.isDown) { this.player.setVelocityY(this.baseSpeed); direction = 'down'; isMoving = true; }
        if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) this.player.body.velocity.normalize().scale(this.baseSpeed);
        if (isMoving) this.player.anims.play(`run_${direction}`, true); else this.player.anims.play('idle_down', true);

        if (this.hasFood) this.heldContainer.setPosition(this.player.x, this.player.y - 40);
        this.player.setDepth(this.player.y);
        
        const needsCook = this.customerGroup.getChildren().some(c => c.state === 'NEEDS_COOKING');
        const isInKitchen = (this.player.x >= 100 && this.player.x <= 650 && this.player.y < 380);
        
        this.cookBtn.setVisible(needsCook && isInKitchen && !this.hasFood && !this.isCooking);

        this.customerGroup.getChildren().forEach(c => {
            c.setDepth(c.y);
            if (c.state === 'ARRIVING') {
                if (Phaser.Math.Distance.Between(c.x, c.y, c.tx, c.ty) < 15) {
                    c.setVelocity(0); c.play(`${c.customerName}_sit`); c.state = 'ORDERING';
                    c.bubble.setPosition(c.x + 35, c.y - 60).setVisible(true);
                }
            } else if (c.state === 'WAITING' && this.hasFood && this.heldFoodKey === c.orderedFood) {
                if (Phaser.Math.Distance.Between(this.player.x, this.player.y, c.x, c.y) < 100) {
                    this.hasFood = false; this.heldContainer.setVisible(false); c.state = 'EATING';
                    this.time.delayedCall(4000, () => {
                        if (c.targetChair) c.targetChair.isOccupied = false;
                        c.play(`${c.customerName}_run_down`); this.physics.moveTo(c, 690, 1170, 150);
                        c.state = 'LEAVING'; this.dropMoney(c.x, c.y, c.orderedFood);
                    });
                }
            } else if (c.state === 'LEAVING' && c.y > 1120) { c.bubble.destroy(); c.destroy(); }
        });
    }

    gainExp(amount) {
        this.exp += amount;
        if (this.exp >= this.expToNextLevel) {
            this.exp -= this.expToNextLevel; this.level++;
            this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);
            this.baseSpeed += 15;
            const lvUp = this.add.text(this.player.x, this.player.y - 50, "LEVEL UP!", { fontSize: '32px', color: '#ffeb3b', fontStyle: 'bold' }).setOrigin(0.5);
            this.tweens.add({ targets: lvUp, y: lvUp.y - 100, alpha: 0, duration: 2000, onComplete: () => lvUp.destroy() });
        }
        this.updateUI();
    }

    updateUI() {
        this.coinText.setText(`💰 Coins: ${this.coins}`);
        this.levelText.setText(`⭐ Level: ${this.level}`);
        this.expBar.width = 130 * (this.exp / this.expToNextLevel);
    }

    spawnCustomer() {
        const freeChair = Phaser.Math.RND.pick(this.allChairs.filter(ch => !ch.isOccupied && this.level >= ch.minLevel));
        if (!freeChair) return;
        freeChair.isOccupied = true;
        const name = ['adam', 'alex', 'bob'][Phaser.Math.Between(0, 2)];
        const customer = this.physics.add.sprite(690, 1070, `${name}_run`).setScale(4.5);
        customer.customerName = name; customer.targetChair = freeChair; customer.state = 'ARRIVING';
        customer.tx = freeChair.x; customer.ty = freeChair.y;
        customer.bubble = this.add.container(0, 0).setVisible(false).setDepth(200);
        const bg = this.add.image(0, 0, 'bubble_pesan').setScale(0.3).setInteractive();
        customer.orderedFood = Phaser.Math.RND.pick(this.foodOptions);
        customer.bubble.add([bg, this.add.image(0, -12, customer.orderedFood).setScale(1.5)]);
        bg.on('pointerdown', () => { if (customer.state === 'ORDERING') { customer.bubble.setVisible(false); customer.state = 'NEEDS_COOKING'; } });
        this.customerGroup.add(customer);
        customer.play(`${name}_run_up`);
        this.physics.moveTo(customer, customer.tx, customer.ty, 150);
    }

    startCooking() {
        const target = this.customerGroup.getChildren().find(c => c.state === 'NEEDS_COOKING');
        if (target && !this.hasFood && !this.isCooking) {
            this.isCooking = true;
            this.cookBtn.setVisible(false); this.prosesImg.setVisible(true);
            this.time.delayedCall(3000, () => {
                this.isCooking = false;
                this.prosesImg.setVisible(false); this.hasFood = true; this.heldFoodKey = target.orderedFood;
                this.heldFoodImg.setTexture(this.heldFoodKey); this.heldContainer.setVisible(true);
                target.state = 'WAITING';
            });
        }
    }

    dropMoney(x, y, foodKey) {
        const money = this.moneyGroup.create(x, y - 30, 'coin').setScale(2);
        money.coinValue = this.foodPrices[foodKey] || 10; money.play('coin_anim');
        const shine = this.add.sprite(x, y - 30, 'shine').setScale(2);
        shine.play('shine_anim');
        this.time.addEvent({ delay: 10, callback: () => { if (money.active) shine.setPosition(money.x, money.y); else shine.destroy(); }, loop: true });
    }
}

// Konfigurasi Scale Mode ENVELOP untuk Full Screen Sempurna
const config = {
    type: Phaser.AUTO,
    scale: { 
        mode: Phaser.Scale.ENVELOP, 
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container', 
        width: 1280, 
        height: 720 
    },
    pixelArt: true,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [MainScene]
};
new Phaser.Game(config);