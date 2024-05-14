class mainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    
    
        this.my = {sprite: {}, text: {}};

    
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets

        this.my.sprite.enemyBullet = [];

        this.my.sprite.topRow = [];
        this.my.sprite.midRow = [];
        this.my.sprite.bottomRow = [];
        
        this.myScore = 0;       // record a score as a class variable
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("ship", "playerShip3_blue.png");
        this.load.image("laser", "laserBlue04.png");


        this.load.image("alienBlue", "shipBlue_manned.png"); 
        this.load.image("alienPink", "shipPink_manned.png");
        this.load.image("alienGreen", "shipGreen_manned.png");
        this.load.image("alienBul", "ghost_hit.png");


        // For animation

        /*this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");*/

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc

        this.load.bitmapFont("honk", "Honk_0.png", "Honk.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles

        //this.load.audio("dadada", "jingles_NES13.ogg");
    }

    create() {
        let my = this.my;

        my.sprite.ship = this.add.sprite(game.config.width/2, game.config.height - 40, "ship");
        my.sprite.ship.setScale(0.5);

        // Create white puff animation
        /*this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });*/

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        this.alienBlueSpeed = 3;

        this.playerHealth = 3;
        this.curRound = 1;
        this.startRound = true;

        document.getElementById('description').innerHTML = '<h2>Main Scene</h2>'

        // Put score on screen
        my.text.score = this.add.bitmapText(10, 0, "honk", "Score " + this.myScore);
        my.text.score.setScale(1.25);

        /*
        this.add.text(10, 5, "alienBlue Hug!", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });
        */
    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.ship.x > (my.sprite.ship.displayWidth/2)) {
                my.sprite.ship.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.ship.x < (game.config.width - (my.sprite.ship.displayWidth/2))) {
                my.sprite.ship.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.ship.x, my.sprite.ship.y-(my.sprite.ship.displayHeight/2), "laser")
                );
            }
        }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        for(let topEnemy of my.sprite.topRow){  
            my.sprite.topRow = my.sprite.topRow.filter((topEnemy) => topEnemy.y > -(topEnemy.displayHeight/2));
        }

        for(let midEnemy of my.sprite.topRow){  
            my.sprite.midRow = my.sprite.midRow.filter((midEnemy) => midEnemy.y > -(midEnemy.displayHeight/2));
        }

        for(let bottomEnemy of my.sprite.bottomRow){  
            my.sprite.bottomRow = my.sprite.bottomRow.filter((bottomEnemy) => bottomEnemy.y > -(bottomEnemy.displayHeight/2));
        }
        

        // Check for collision with any enemy
        for (let bullet of my.sprite.bullet) {
            for(let topEnemy of my.sprite.topRow){
                if (this.collides(topEnemy, bullet)) {
                    //this.puff = this.add.sprite(my.sprite.alienBlue.x, my.sprite.alienBlue.y, "whitePuff03").setScale(0.25).play("puff");
                    
                    bullet.y = -100;
                    topEnemy.visible = false;
                    topEnemy.y = -100;
                    // Update score
                    this.myScore += topEnemy.scorePoints;
                    this.updateScore();
    
            }

            for(let midEnemy of my.sprite.midRow){
                if (this.collides(midEnemy, bullet)) {
                    //this.puff = this.add.sprite(my.sprite.alienBlue.x, my.sprite.alienBlue.y, "whitePuff03").setScale(0.25).play("puff");
                    
                    bullet.y = -100;
                    midEnemy.visible = false;
                    midEnemy.y = -100;
                    // Update score
                    this.myScore += midEnemy.scorePoints;
                    this.updateScore();
    
            }
        }

        for(let bottomEnemy of my.sprite.bottomRow){
            if (this.collides(bottomEnemy, bullet)) {
                //this.puff = this.add.sprite(my.sprite.alienBlue.x, my.sprite.alienBlue.y, "whitePuff03").setScale(0.25).play("puff");
                
                bullet.y = -100;
                bottomEnemy.visible = false;
                bottomEnemy.y = -100;
                // Update score
                this.myScore += bottomEnemy.scorePoints;
                this.updateScore();

        }
    }
                /*
                // Play sound
                //this.sound.play("dadada", {
                    //volume: 1   // Can adjust volume using this, goes from 0 to 1
                //});
                // Have new alienBlue appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.alienBlue.visible = true;
                    this.my.sprite.alienBlue.x = Math.random()*config.width;
                }, this);
                */
        }
    }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        //HANDLING HOW ROUNDS WORK
        if (this.startRound){
            this.fillEnemies();
            this.startRound = false;
        }

        if(my.sprite.topRow.length == 0 && my.sprite.midRow.length == 0 && my.sprite.bottomRow.length == 0 && this.myScore > 0){
            this.startRound = true;
            this.curRound += 1;
        }

        console.log(my.sprite.topRow.length);

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

    fillEnemies(){
        let my = this.my;
        let offsetTop = 0;
        let offsetMid = 0;
        let offsetBottom = 0;
        let i = 0;
        let j = 0;
        let k = 0;
        //TOP ROW ENEMY SPAWNS
        for (i < 0; i < 10; i++){
            my.sprite.topRow.push(this.add.sprite(
                70 + offsetTop, game.config.height/4, "alienBlue")
            );
            my.sprite.topRow[i].setScale(0.4);
            my.sprite.topRow[i].scorePoints = 100;
            offsetTop += 70;
        }
        //MIDDLE ROW ENEMY SPAWNS
        for (j < 0; j < 12; j++){
            my.sprite.midRow.push(this.add.sprite(
                100 + offsetMid, game.config.height/2.8, "alienPink")
            );
            my.sprite.midRow[j].setScale(0.3);
            my.sprite.midRow[j].scorePoints = 120;
            offsetMid += 50;
        }
        
        for (k < 0; k < 8; k++){
            my.sprite.bottomRow.push(this.add.sprite(
                90 + offsetBottom, game.config.height/2.1, "alienGreen")
            );
            my.sprite.bottomRow[k].setScale(0.4);
            my.sprite.bottomRow[k].scorePoints = 150;
            offsetBottom += 70;
        }
    }

    enemyAI(){
        let topTime = 13;
        let midTime = 9;
        let bottomTime = 20;
        for (let topEnemy of my.sprite.topRow) {
            
        }
    }
}