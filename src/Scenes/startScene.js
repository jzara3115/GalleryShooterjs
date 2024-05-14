class startScene extends Phaser.Scene {
    constructor() {
        super("StartingScene");

        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.bitmapFont("honk", "Honk_0.png", "Honk.fnt");
    }

    create() {
        let my = this.my;

        document.getElementById('description').innerHTML = '<h2>Start menu</h2>'

        this.nextScene = this.input.keyboard.addKey("S");

        my.text.score = this.add.bitmapText(game.config.width/3, game.config.height/3, "honk", "CLICK TO START");
        my.text.score.setScale(1.25);

        this.startScale = 1.5;
        this.endScale = 0.7;
        this.tempScale = 0; 

        this.tweening = true;

        this.tweenDuration = 2000; // milliseconds

        this.input.on('pointerdown', (pointer) => {
            this.scene.start("MainScene");
        });
    }

    update(){
        if (this.tweening){
            this.time.addEvent({
                delay: 0,
                callback: this.tweenScale,
                callbackScope: this,
                duration: this.tweenDuration,
              });
        this.tweening = false;
        }
            
    }

    tweenScale() {
        this.tweens.add({
          targets: this.my.text.score,
          scaleX: this.endScale,
          scaleY: this.endScale,
          duration: this.tweenDuration,
          ease: 'Sine',
          onComplete: () => {
            // Swap starting and ending values for continuous looping
            this.tempScale = this.endScale;
            this.endScale = this.startScale;
            this.startScale = this.tempScale;
            this.tweening = true;
          },
        });
      }
}