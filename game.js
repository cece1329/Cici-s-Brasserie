// --- CICI'S BRASSERIE: THE PERFECT DYNAMIC & BUG-FREE EDITION ---

// ==========================================
// 1. INTRO SCENE (MAIN MENU SCREEN)
// ==========================================
class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    preload() {
        this.load.image('intro_bg', 'asetgamepjbl/intro.png');
        this.load.spritesheet('amelia_idle', 'asetgamepjbl/barista/Amelia_idle_anim_16x16.png', { frameWidth: 16, frameHeight: 32 });
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Trik anti-gepeng untuk background Intro
        let bg = this.add.image(width / 2, height / 2, 'intro_bg').setOrigin(0.5);
        let scaleX = width / bg.width;
        let scaleY = height / bg.height;
        let scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        this.add.rectangle(0, 0, width, height, 0x2d1b18, 0.55).setOrigin(0);

        if (!this.anims.exists('menu_amelia_idle')) {
            this.anims.create({
                key: 'menu_amelia_idle',
                frames: this.anims.generateFrameNumbers('amelia_idle', { start: 18, end: 23 }),
                frameRate: 6,
                repeat: -1
            });
        }

        let menuPlayer = this.add.sprite(width / 2, height / 2 - 30, 'amelia_idle').setScale(5.5);
        menuPlayer.play('menu_amelia_idle');

        this.add.text(width / 2, height / 2 - 170, "CICI'S BRASSERIE", {
            fontSize: '54px', fill: '#ffb74d', fontStyle: 'bold', fontFamily: 'Courier New', stroke: '#3e2723', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2 - 110, "Kelola Kafe Pixel Impianmu ✨", {
            fontSize: '20px', fill: '#fff3e0', fontStyle: 'italic', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        let startBtn = this.add.text(width / 2, height / 2 + 100, " 🌸 START GAME 🌸 ", {
            fontSize: '26px', fill: '#ffffff', backgroundColor: '#f48fb1', padding: { x: 25, y: 12 }, fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        let howToBtn = this.add.text(width / 2, height / 2 + 175, " 📋 HOW TO PLAY 📋 ", {
            fontSize: '22px', fill: '#fff3e0', backgroundColor: '#8d6e63', padding: { x: 20, y: 10 }, fontFamily: 'Courier New', fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        startBtn.on('pointerover', () => startBtn.setStyle({ backgroundColor: '#f06292' }));
        startBtn.on('pointerout', () => startBtn.setStyle({ backgroundColor: '#f48fb1' }));
        howToBtn.on('pointerover', () => howToBtn.setStyle({ backgroundColor: '#5d4037' }));
        howToBtn.on('pointerout', () => howToBtn.setStyle({ backgroundColor: '#8d6e63' }));

        startBtn.on('pointerdown', () => this.scene.start('MainScene'));

        let tutorialGroup = this.add.container(0, 0).setDepth(2000).setVisible(false);
        let tutBg = this.add.rectangle(width / 2, height / 2, 750, 430, 0x3e2723, 0.95).setStrokeStyle(5, '#ffb74d');

        let tutTitle = this.add.text(width / 2, height / 2 - 165, "--- CARA BERMAIN ---", {
            fontSize: '30px', fontStyle: 'bold', fill: '#ffb74d', fontFamily: 'Courier New'
        }).setOrigin(0.5);

        let tutContent = this.add.text(width / 2, height / 2 - 10,
            "🏃 KONTROL GERAK:\nGunakan tombol W, A, S, D di keyboard untuk menggerakkan Amelia keliling kafe.\n\n" +
            "☕ ALUR BISNIS KAFE:\n1. Klik Bubble Chat Pesanan di atas kepala pelanggan.\n2. Berjalan ke area dapur atas, lalu klik tombol KOKI [MASAK].\n3. Tunggu sampai matang, dekati meja bar untuk ambil makanan.\n4. Dekati pelanggan yang memesan untuk mengantarkannya.\n5. Ambil koin emas 💰 di meja setelah mereka selesai makan!\n\n" +
            "🛒 UPGRADE KAFE:\nGunakan koinmu di menu SHOP untuk membuka resep menu baru!\n" +
            "⏸️ PAUSE MENU:\nTekan tombol P, ESC, atau klik tombol PAUSE di navbar.", {
            fontSize: '14px', fill: '#ffffff', fontFamily: 'Courier New', lineHeight: 1.4, wordWrap: { width: 690 }
        }).setOrigin(0.5);

        let closeTutBtn = this.add.text(width / 2, height / 2 + 170, " [ CLOSE ] ", {
            fontSize: '20px', fill: '#ffffff', backgroundColor: '#d32f2f', padding: 8, fontFamily: 'Courier New'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeTutBtn.on('pointerover', () => closeTutBtn.setStyle({ backgroundColor: '#b71c1c' }));
        closeTutBtn.on('pointerout', () => closeTutBtn.setStyle({ backgroundColor: '#d32f2f' }));
        tutorialGroup.add([tutBg, tutTitle, tutContent, closeTutBtn]);

        howToBtn.on('pointerdown', () => tutorialGroup.setVisible(true));
        closeTutBtn.on('pointerdown', () => tutorialGroup.setVisible(false));

        this.add.text(width / 2, height - 25, "© 2026 Kafe Cici Project. All Rights Reserved.", { fontSize: '12px', fill: '#b0bec5', fontFamily: 'Arial' }).setOrigin(0.5);
    }
}

// ==========================================
// 2. MAIN SCENE (GAMEPLAY UTAMA)
// ==========================================
class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    preload() {
        const width = this.scale.width;
        const height = this.scale.height;
        const loadingText = this.add.text(width / 2, height / 2, "Mempersiapkan Kafe Cici... 0%", { fontSize: '32px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        this.load.on('progress', (v) => loadingText.setText(`Mempersiapkan Kafe Cici... ${Math.floor(v * 100)}%`));
        this.load.on('complete', () => loadingText.destroy());

        this.load.spritesheet('amelia_idle', 'asetgamepjbl/barista/Amelia_idle_anim_16x16.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('amelia_run', 'asetgamepjbl/barista/Amelia_run_16x16.png', { frameWidth: 16, frameHeight: 32 });

        ['adam', 'alex', 'bob'].forEach(name => {
            const path = `asetgamepjbl/pelanggan/${name.charAt(0).toUpperCase() + name.slice(1)}/`;
            const base = name.charAt(0).toUpperCase() + name.slice(1);
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
        const width = this.scale.width;
        const height = this.scale.height;
        this.isGamePaused = false;

        // --- ANIMATIONS ---
        this.anims.create({ key: 'run_right', frames: this.anims.generateFrameNumbers('amelia_run', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run_up', frames: this.anims.generateFrameNumbers('amelia_run', { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run_left', frames: this.anims.generateFrameNumbers('amelia_run', { start: 12, end: 17 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'run_down', frames: this.anims.generateFrameNumbers('amelia_run', { start: 18, end: 23 }), frameRate: 10, repeat: -1 });

        if (!this.anims.exists('idle_down')) {
            this.anims.create({ key: 'idle_down', frames: this.anims.generateFrameNumbers('amelia_idle', { start: 18, end: 23 }), frameRate: 6, repeat: -1 });
        }

        ['adam', 'alex', 'bob'].forEach(name => {
            this.anims.create({ key: `${name}_run_up`, frames: this.anims.generateFrameNumbers(`${name}_run`, { start: 6, end: 11 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: `${name}_run_down`, frames: this.anims.generateFrameNumbers(`${name}_run`, { start: 18, end: 23 }), frameRate: 10, repeat: -1 });
            this.anims.create({ key: `${name}_sit`, frames: this.anims.generateFrameNumbers(`${name}_sit`, { start: 0, end: 3 }), frameRate: 5, repeat: -1 });
        });
        this.anims.create({ key: 'coin_anim', frames: this.anims.generateFrameNumbers('coin'), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'shine_anim', frames: this.anims.generateFrameNumbers('shine'), frameRate: 8, repeat: -1 });

        // --- MAP & PHYSICS (ANTI-GEPENG FIX) ---
        this.mapBg = this.add.image(0, 0, 'indoor').setOrigin(0, 0);

        let sX = width / this.mapBg.width;
        let sY = height / this.mapBg.height;
        this.perfectScale = Math.max(sX, sY);
        this.mapBg.setScale(this.perfectScale);

        // Menghitung dimensi map real setelah di-scale
        const realMapWidth = this.mapBg.width * this.perfectScale;
        const realMapHeight = this.mapBg.height * this.perfectScale;

        this.physics.world.setBounds(0, 0, realMapWidth, realMapHeight);

        this.walls = this.physics.add.staticGroup();
        const addWall = (x, y, w, h) => {
            const r = this.add.rectangle(x + w / 2, y + h / 2, w, h, 0xff0000, 0.5).setDepth(999);
            this.physics.add.existing(r, true);
            this.walls.add(r);
        };
        addWall(0, 0, realMapWidth, 20);
        addWall(0, realMapHeight - 20, realMapWidth, 20);
        addWall(0, 0, 20, realMapHeight);
        addWall(realMapWidth - 20, 0, 20, realMapHeight);

        // 1. TOP WALL (Dinding Atas & Kabinet Dapur)
        addWall(0, 0, realMapWidth, realMapHeight * 0.27);

        // 2. KITCHEN FRONT (Meja merah panjang + Bar Stools)
        addWall(realMapWidth * 0.05, realMapHeight * 0.32, realMapWidth * 0.42, realMapHeight * 0.16);

        // 3. KITCHEN SIDE (Meja merah vertikal + Stools samping)
        addWall(realMapWidth * 0.47, realMapHeight * 0.27, realMapWidth * 0.06, realMapHeight * 0.11);


        // 5. STAIRS (Tangga Kanan) -> Digeser mepet ke kanan agar tidak menutupi karpet oval
        addWall(realMapWidth * 0.82, realMapHeight * 0.27, realMapWidth * 0.06, realMapHeight * 0.08);

        // 6. VENDING MACHINE (Mesin Minuman Kanan)
        addWall(realMapWidth * 0.87, realMapHeight * 0.3, realMapWidth * 0.13, realMapHeight * 0.32);

        // 7. MEJA PELANGGAN & KURSI (Kelompok Meja)
        // Group A (Kiri Bawah) -> Dipersempit agar ada celah jalan
        addWall(realMapWidth * 0.02, realMapHeight * 0.6, realMapWidth * 0.13, realMapHeight * 0.24);

        // Group B (Tengah Kiri) -> Digeser ke kanan dikit agar celah dengan Group A lebih lebar
        addWall(realMapWidth * 0.22, realMapHeight * 0.55, realMapWidth * 0.16, realMapHeight * 0.23);

        // Group C (Kanan Atas)
        addWall(realMapWidth * 0.65, realMapHeight * 0.55, realMapWidth * 0.15, realMapHeight * 0.15);

        // Group D (Meja Bundar Kanan Bawah)
        addWall(realMapWidth * 0.65, realMapHeight * 0.72, realMapWidth * 0.2, realMapHeight * 0.22);

        // Group E (Meja Lampu Samping Vending Machine) -> Dikembalikan
        addWall(realMapWidth * 0.84, realMapHeight * 0.63, realMapWidth * 0.06, realMapHeight * 0.12);



        // 8. DEKORASI LAINNYA
        // Tanaman Kiri Bawah
        addWall(0, realMapHeight * 0.84, realMapWidth * 0.08, realMapHeight * 0.16);
        // Tanaman Kanan Bawah
        addWall(realMapWidth * 0.92, realMapHeight * 0.84, realMapWidth * 0.08, realMapHeight * 0.16);
        // Sofa Bawah (Dekat pintu masuk)
        addWall(realMapWidth * 0.29, realMapHeight * 0.86, realMapWidth * 0.12, realMapHeight * 0.11);

        // --- STATUS GAME ---
        this.coins = 0;
        this.level = 1;
        this.exp = 0;
        this.expToNextLevel = 50;
        this.baseSpeed = 250;
        this.foodPrices = { 'food_coffee': 5, 'food_burger': 10, 'food_croissant': 15, 'food_cake': 30 };
        this.foodOptions = ['food_coffee'];
        this.hasFood = false; this.isCooking = false;

        this.allChairs = [
            { x: realMapWidth * 0.08, y: realMapHeight * 0.42, isOccupied: false, minLevel: 1 }, // Bar Stool
            { x: realMapWidth * 0.23, y: realMapHeight * 0.42, isOccupied: false, minLevel: 1 }, // Bar Stool
            { x: realMapWidth * 0.25, y: realMapHeight * 0.66, isOccupied: false, minLevel: 2 }, // Meja Kiri
            { x: realMapWidth * 0.15, y: realMapHeight * 0.56, isOccupied: false, minLevel: 3 }, // Meja Kiri
            { x: realMapWidth * 0.55, y: realMapHeight * 0.62, isOccupied: false, minLevel: 4 }  // Meja Kanan
        ];

        // --- PLAYER (AMELIA) ---
        this.player = this.physics.add.sprite(realMapWidth * 0.21, realMapHeight * 0.28, 'amelia_idle').setScale(4.5);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(8, 6).setOffset(4, 26);
        this.player.setDepth(100);
        this.player.play('idle_down');
        this.physics.add.collider(this.player, this.walls);

        // --- ⚡ FIX UTAMA: SETTING KAMERA ZOOM BIAR KAFE KELIHATAN DEKAT ⚡ ---
        this.cameras.main.setBounds(0, 0, realMapWidth, realMapHeight);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.3); // Kamera zoom diperkecil supaya gak terlalu dekat

        this.cursors = this.input.keyboard.addKeys('W,A,S,D');
        this.pauseKeyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.pauseKeyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // --- NAVBAR HUD SYSTEM ---
        const z = 1.3;
        const uiScale = 1 / z;
        const uiX = (width / 2) * (z - 1) / z;
        const uiY = (height / 2) * (z - 1) / z;

        this.hudContainer = this.add.container(uiX, uiY).setScrollFactor(0).setDepth(9999);
        this.hudContainer.setScale(uiScale);

        this.navBg = this.add.rectangle(0, 0, width, 70, 0x3e2723, 0.9).setOrigin(0).setScrollFactor(0);
        this.coinText = this.add.text(20, 20, `💰 Coins: ${this.coins}`, { fontSize: '22px', fill: '#ffd54f', fontStyle: 'bold' }).setScrollFactor(0);
        this.levelText = this.add.text(width - 170, 20, `⭐ Level: ${this.level}`, { fontSize: '22px', fill: '#fff', fontStyle: 'bold' }).setScrollFactor(0);
        this.expBar = this.add.rectangle(width - 170, 50, 0, 10, 0x4caf50).setOrigin(0).setScrollFactor(0);

        this.shopBtn = this.add.text(width / 2 - 130, 35, "🛒 SHOP", { fontSize: '18px', backgroundColor: '#4e342e', padding: 8 }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });
        this.pauseBtn = this.add.text(width / 2, 35, "⏸ PAUSE", { fontSize: '18px', backgroundColor: '#d84315', padding: 8 }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });
        this.menuBtn = this.add.text(width / 2 + 130, 35, "📋 MENU", { fontSize: '18px', backgroundColor: '#4e342e', padding: 8 }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });

        this.hudContainer.add([this.navBg, this.coinText, this.levelText, this.expBar, this.shopBtn, this.pauseBtn, this.menuBtn]);
        this.pauseBtn.on('pointerdown', () => this.togglePauseGame());

        // --- SHOP & MENU LOGIC ---
        this.shopContainer = this.add.container(uiX, uiY).setScrollFactor(0).setDepth(2000).setScale(uiScale).setVisible(false);
        this.shopElements = [];
        const shopBg = this.add.rectangle(width / 2, height / 2, 450, 420, 0x3e2723).setStrokeStyle(4, 0x795548).setScrollFactor(0);
        const shopTitle = this.add.text(width / 2, height / 2 - 170, "UPGRADE SHOP", { fontSize: '28px', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0);
        this.shopContainer.add([shopBg, shopTitle]);
        this.shopElements.push(shopBg, shopTitle);

        const addItem = (foodKey, cost, reqLevel, yOffset) => {
            const bg = this.add.rectangle(width / 2, height / 2 + yOffset, 400, 55, 0x4e342e).setInteractive({ useHandCursor: true }).setScrollFactor(0);
            const icon = this.add.image(width / 2 - 160, height / 2 + yOffset, foodKey).setScale(1.8).setScrollFactor(0);
            const name = foodKey.split('_')[1].toUpperCase();
            const text = this.add.text(width / 2 - 120, height / 2 + yOffset, `Unlock ${name} (${cost} Coins) [REQ LV ${reqLevel}]`, { fontSize: '13px' }).setOrigin(0, 0.5).setScrollFactor(0);
            this.shopContainer.add([bg, icon, text]);
            this.shopElements.push(bg, icon, text);
            bg.on('pointerdown', () => {
                if (this.isGamePaused) return;
                if (this.coins >= cost && this.level >= reqLevel && !this.foodOptions.includes(foodKey)) {
                    this.coins -= cost; this.foodOptions.push(foodKey); this.updateUI();
                    text.setText(`${name} UNLOCKED!`); bg.setFillStyle(0x2e7d32);
                }
            });
        };
        addItem('food_burger', 30, 2, -100); addItem('food_croissant', 60, 3, -40); addItem('food_cake', 100, 5, 20);

        const closeBtn = this.add.text(width / 2, height / 2 + 110, " [ CLOSE ] ", { fontSize: '24px', backgroundColor: '#ff5252', padding: 10 }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setScrollFactor(0);
        this.shopContainer.add(closeBtn);
        this.shopElements.push(closeBtn);
        closeBtn.on('pointerdown', () => this.shopContainer.setVisible(false));
        this.shopBtn.on('pointerdown', () => { if (this.isGamePaused) return; this.menuContainer.setVisible(false); this.shopContainer.setVisible(true); });

        this.menuContainer = this.add.container(uiX, uiY).setScrollFactor(0).setDepth(2000).setScale(uiScale).setVisible(false);
        this.menuElements = [];
        const menuBg = this.add.rectangle(width / 2, height / 2, 500, 400, 0x2d1b18).setStrokeStyle(4, 0x8d6e63).setScrollFactor(0);
        const menuTitle = this.add.text(width / 2, height / 2 - 160, "OUR MENU", { fontSize: '32px', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0);
        const closeMenuBtn = this.add.text(width / 2, height / 2 + 160, " [ BACK ] ", { fontSize: '24px', backgroundColor: '#5d4037', padding: 8 }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setScrollFactor(0);
        this.menuContainer.add([menuBg, menuTitle, closeMenuBtn]);
        this.menuElements = [menuBg, menuTitle, closeMenuBtn];

        this.menuBtn.on('pointerdown', () => {
            if (this.isGamePaused) return;
            this.shopContainer.setVisible(false);
            this.menuElements.forEach(el => { if (el.isFoodItem) el.destroy(); });
            this.menuElements = this.menuElements.filter(el => !el.isFoodItem);
            this.menuContainer.setVisible(true);
            this.foodOptions.forEach((food, index) => {
                const y = height / 2 - 80 + (index * 60);
                const icon = this.add.image(width / 2 - 180, y, food).setScale(2).setScrollFactor(0);
                const text = this.add.text(width / 2 - 140, y, `${food.split('_')[1].toUpperCase()} - 💰${this.foodPrices[food]}`, { fontSize: '20px' }).setOrigin(0, 0.5).setScrollFactor(0);
                icon.isFoodItem = true; text.isFoodItem = true;
                this.menuContainer.add([icon, text]);
                this.menuElements.push(icon, text);
            });
        });
        closeMenuBtn.on('pointerdown', () => this.menuContainer.setVisible(false));

        // --- POP-UP OVERLAY PAUSE ---
        this.pauseContainer = this.add.container(uiX, uiY).setScrollFactor(0).setDepth(10000).setScale(uiScale).setVisible(false);
        this.pauseElements = [];
        let pBg = this.add.rectangle(width / 2, height / 2, 450, 380, 0x4e342e, 0.95).setStrokeStyle(5, 0xf48fb1).setScrollFactor(0);
        let pTitle = this.add.text(width / 2, height / 2 - 120, "KAFE DI-ISTIRAHATKAN", { fontSize: '28px', fontStyle: 'bold', fill: '#fff3e0', fontFamily: 'Courier New' }).setOrigin(0.5).setScrollFactor(0);
        let btnResume = this.add.text(width / 2, height / 2 - 25, "  🌸 KEMBALI BEKERJA  ", { fontSize: '18px', fill: '#ffffff', backgroundColor: '#f48fb1', padding: 12, fontFamily: 'Courier New', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });
        let btnRestart = this.add.text(width / 2, height / 2 + 40, "  🔄 ULANG HARI INI  ", { fontSize: '18px', fill: '#4e342e', backgroundColor: '#ffe0b2', padding: 12, fontFamily: 'Courier New', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });
        let btnExit = this.add.text(width / 2, height / 2 + 105, "  🚪 PULANG KE MENU   ", { fontSize: '18px', fill: '#ffffff', backgroundColor: '#880e4f', padding: 12, fontFamily: 'Courier New', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0).setInteractive({ useHandCursor: true });

        this.pauseContainer.add([pBg, pTitle, btnResume, btnRestart, btnExit]);
        this.pauseElements = [pBg, pTitle, btnResume, btnRestart, btnExit];
        btnResume.on('pointerdown', () => this.togglePauseGame());
        btnRestart.on('pointerdown', () => this.scene.restart());
        btnExit.on('pointerdown', () => this.scene.start('IntroScene'));

        // --- GAMEPLAY ELEMENTS & GROUPS ---
        this.customerGroup = this.physics.add.group();
        this.moneyGroup = this.physics.add.group();

        // --- 🍳 POSISI TOMBOL MASAK AMAN (Disesuaikan dengan origin 0,0 mapBg) 🍳 ---
        // Dengan origin map 0,0 letak visual dapur sesuai dengan koordinat physics
        this.cookBtn = this.add.text(realMapWidth * 0.25, realMapHeight * 0.23, "🍳 MASAK 🍳", {
            fontSize: '15px',
            backgroundColor: '#8d6e63',
            padding: 8,
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false).setDepth(500);

        this.prosesImg = this.add.image(realMapWidth * 0.25, realMapHeight * 0.23, 'proses').setScale(0.5).setVisible(false).setDepth(500);

        this.heldContainer = this.add.container(0, 0).setVisible(false).setDepth(150);
        this.heldContainer.add([this.add.image(0, 8, 'plate').setScale(3), this.heldFoodImg = this.add.image(0, -8, 'food_coffee').setScale(1.5)]);

        this.cookBtn.on('pointerdown', () => this.startCooking());
        this.customerTimer = this.time.addEvent({ delay: 10000, callback: () => this.spawnCustomer(), loop: true });
        this.spawnCustomer();

        // (Overlap untuk koin dihapus karena dihandle oleh sistem Magnetik di update)

        this.isFoodOnCounter = false; this.counterFoodKey = '';
        this.counterFoodSprite = this.add.container(realMapWidth * 0.33, realMapHeight * 0.31).setVisible(false).setDepth(80);
        this.counterPlateImg = this.add.image(0, 5, 'plate').setScale(2.5);
        this.counterFoodImg = this.add.image(0, -5, 'food_coffee').setScale(1.2);
        this.counterFoodSprite.add([this.counterPlateImg, this.counterFoodImg]);

        this.updateUI();
    }

    togglePauseGame() {
        this.isGamePaused = !this.isGamePaused;
        if (this.isGamePaused) {
            this.player.setVelocity(0); this.player.anims.stop();
            this.physics.world.pause();
            this.customerTimer.paused = true;
            this.customerGroup.getChildren().forEach(c => {
                c.setVelocity(0);
                c.anims.stop();
            });
            this.pauseContainer.setVisible(true);
        } else {
            this.physics.world.resume();
            this.customerTimer.paused = false;
            this.pauseContainer.setVisible(false);

            const realMapWidth = this.mapBg.width * this.perfectScale;
            const realMapHeight = this.mapBg.height * this.perfectScale;
            this.customerGroup.getChildren().forEach(c => {
                if (c.state === 'ARRIVING') {
                    c.play(`${c.customerName}_run_up`, true);
                    this.physics.moveTo(c, c.tx, c.ty, 150);
                } else if (c.state === 'LEAVING') {
                    c.play(`${c.customerName}_run_down`, true);
                    this.physics.moveTo(c, realMapWidth * 0.49, realMapHeight + 50, 150);
                } else if (c.state === 'ORDERING' || c.state === 'WAITING' || c.state === 'EATING') {
                    c.play(`${c.customerName}_sit`, true);
                }
            });
        }
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.pauseKeyP) || Phaser.Input.Keyboard.JustDown(this.pauseKeyEsc)) {
            this.togglePauseGame();
        }

        if (this.isGamePaused) return;

        const realMapWidth = this.mapBg.width * this.perfectScale;
        const realMapHeight = this.mapBg.height * this.perfectScale;

        let isMoving = false; let direction = 'down'; this.player.setVelocity(0);
        if (this.cursors.A.isDown) { this.player.setVelocityX(-this.baseSpeed); direction = 'left'; isMoving = true; }
        else if (this.cursors.D.isDown) { this.player.setVelocityX(this.baseSpeed); direction = 'right'; isMoving = true; }
        if (this.cursors.W.isDown) { this.player.setVelocityY(-this.baseSpeed); direction = 'up'; isMoving = true; }
        else if (this.cursors.S.isDown) { this.player.setVelocityY(this.baseSpeed); direction = 'down'; isMoving = true; }
        if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) this.player.body.velocity.normalize().scale(this.baseSpeed);
        if (isMoving) this.player.anims.play(`run_${direction}`, true); else this.player.anims.play('idle_down', true);

        if (this.hasFood) this.heldContainer.setPosition(this.player.x, this.player.y - 50);
        this.player.setDepth(this.player.y);

        const needsCook = this.customerGroup.getChildren().some(c => c.state === 'NEEDS_COOKING');
        const isInKitchen = (this.player.x >= realMapWidth * 0.07 && this.player.x <= realMapWidth * 0.46 && this.player.y < realMapHeight * 0.33);

        this.cookBtn.setVisible(needsCook && isInKitchen && !this.hasFood && !this.isCooking);

        if (this.isFoodOnCounter && !this.hasFood) {
            let distanceToCounter = Phaser.Math.Distance.Between(this.player.x, this.player.y, realMapWidth * 0.33, realMapHeight * 0.31);
            if (distanceToCounter < 110) {
                this.isFoodOnCounter = false; this.counterFoodSprite.setVisible(false); this.hasFood = true;
                this.heldFoodKey = this.counterFoodKey; this.heldFoodImg.setTexture(this.heldFoodKey);
                this.heldContainer.setVisible(true);
            }
        }

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
                        c.play(`${c.customerName}_run_down`); this.physics.moveTo(c, realMapWidth * 0.49, realMapHeight + 50, 150);
                        c.state = 'LEAVING'; this.dropMoney(c.x, c.y, c.orderedFood);
                    });
                }
            } else if (c.state === 'LEAVING' && c.y > realMapHeight) { c.bubble.destroy(); c.destroy(); }
        });

        // Efek Koin Magnetik ke Navbar UI
        this.moneyGroup.getChildren().forEach(m => {
            if (m.isCollected) return;

            let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, m.x, m.y);
            if (dist < 180) { // Jarak ambil otomatis
                m.isCollected = true;
                let val = m.coinValue;
                let startX = m.x; let startY = m.y;
                m.destroy(); // Hancurkan koin fisik di meja

                // Buat sprite terbang palsu untuk efek animasi ke UI
                let flyingCoin = this.add.sprite(startX, startY, 'coin').setScale(2).setDepth(9999);

                this.tweens.add({
                    targets: flyingCoin,
                    // Terbang ke arah pojok kiri atas kamera (tempat navbar coin berada)
                    x: { getEnd: () => this.cameras.main.worldView.x + 60 },
                    y: { getEnd: () => this.cameras.main.worldView.y + 40 },
                    duration: 600,
                    ease: 'Cubic.easeIn', // Meluncur cepat
                    onUpdate: () => {
                        // Bikin efek trail ngikutin koin terbang
                        if (Math.random() > 0.3) {
                            let trail = this.add.sprite(flyingCoin.x, flyingCoin.y, 'coin').setScale(1.5).setAlpha(0.4).setDepth(9998);
                            this.tweens.add({ targets: trail, alpha: 0, scale: 0.5, duration: 250, onComplete: () => trail.destroy() });
                        }
                    },
                    onComplete: () => {
                        flyingCoin.destroy();
                        this.coins += val;
                        this.gainExp(20);
                        this.updateUI();
                        // Efek UI koin berdetak
                        this.tweens.add({ targets: this.coinText, scaleX: 1.2, scaleY: 1.2, yoyo: true, duration: 150 });
                    }
                });

                // Efek tulisan melayang dari meja
                let popText = this.add.text(startX, startY - 20, `+${val}`, { fontSize: '24px', fill: '#ffd54f', fontStyle: 'bold' }).setOrigin(0.5).setDepth(2000);
                this.tweens.add({ targets: popText, y: popText.y - 50, alpha: 0, duration: 1000, onComplete: () => popText.destroy() });
            }
        });
    }

    gainExp(amount) {
        this.exp += amount;
        if (this.exp >= this.expToNextLevel) {
            this.exp -= this.expToNextLevel; this.level++;
            this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5); this.baseSpeed += 15;
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
        if (this.isGamePaused) return;
        const realMapWidth = this.mapBg.width * this.perfectScale;
        const realMapHeight = this.mapBg.height * this.perfectScale;

        const freeChair = Phaser.Math.RND.pick(this.allChairs.filter(ch => !ch.isOccupied && this.level >= ch.minLevel));
        if (!freeChair) return;
        freeChair.isOccupied = true;
        const name = ['adam', 'alex', 'bob'][Phaser.Math.Between(0, 2)];
        const customer = this.physics.add.sprite(realMapWidth * 0.49, realMapHeight + 20, `${name}_run`).setScale(4.5);
        customer.customerName = name; customer.targetChair = freeChair; customer.state = 'ARRIVING';
        customer.tx = freeChair.x; customer.ty = freeChair.y;
        customer.bubble = this.add.container(0, 0).setVisible(false).setDepth(200);
        const bg = this.add.image(0, 0, 'bubble_pesan').setScale(0.3).setInteractive({ useHandCursor: true });
        customer.orderedFood = Phaser.Math.RND.pick(this.foodOptions);
        customer.bubble.add([bg, this.add.image(0, -12, customer.orderedFood).setScale(1.5)]);
        bg.on('pointerdown', () => {
            if (this.isGamePaused) return;
            if (customer.state === 'ORDERING') { customer.bubble.setVisible(false); customer.state = 'NEEDS_COOKING'; }
        });
        this.customerGroup.add(customer);
        customer.play(`${name}_run_up`);
        this.physics.moveTo(customer, customer.tx, customer.ty, 150);
    }

    startCooking() {
        if (this.isGamePaused) return;
        const target = this.customerGroup.getChildren().find(c => c.state === 'NEEDS_COOKING');
        if (target && !this.hasFood && !this.isCooking) {
            this.isCooking = true;
            this.cookBtn.setVisible(false); this.prosesImg.setVisible(true);
            this.time.delayedCall(3000, () => {
                this.isCooking = false; this.prosesImg.setVisible(false);
                this.isFoodOnCounter = true; this.counterFoodKey = target.orderedFood;
                this.counterFoodImg.setTexture(this.counterFoodKey); this.counterFoodSprite.setVisible(true);
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

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        width: '100%',
        height: '100%'
    },
    pixelArt: true,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [IntroScene, MainScene]
};
new Phaser.Game(config);