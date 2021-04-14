class IsometricKeyboardCharacterController extends KeyboardCharacterController{
    pressedKeys = [];
    constructor(character) {
        super(character);
    }

    apply() {
        if(this.pressedKeys.length == 0) {
            return;
        }
        var cardinalPoint = "";
        for(var key of this.pressedKeys) {
            switch(key) {
                case "ArrowUp" :
                    cardinalPoint = "ne";
                    break;
                case "ArrowDown" :
                    cardinalPoint = "sw";
                    break;
                case "ArrowLeft" :
                    cardinalPoint = "nw";
                    break;
                case "ArrowRight" :
                    cardinalPoint ="se";
                    break;
            }
        }

        if(this.pressedKeys.indexOf("Space") > -1) {
            this.character.jump();
        }

        if(cardinalPoint) {
            this.character.move(cardinalPoint);
        }
    }
}