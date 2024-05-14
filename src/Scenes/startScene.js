class startScene extends Phaser.Scene {
    constructor() {
        super("StartingScene");
    }

    preload() {

    }

    create() {
        document.getElementById('description').innerHTML = '<h2>Start menu</h2>'

        this.nextScene = this.input.keyboard.addKey("S");
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("MainScene");
        }
    }
}