class KeyboardCharacterController extends CharacterController{
    pressedKeys = [];
    constructor(character) {
        super();
        var reference = this;
        reference.character = character;
        document.body.addEventListener("keydown", event => {
            if(reference.pressedKeys.indexOf(event.code) < 0) {
                reference.pressedKeys.push(event.code)
            }
            reference.apply()
        });
    
        document.body.addEventListener("keyup", event => {
            reference.pressedKeys.splice(reference.pressedKeys.indexOf(event.code), 1);
            reference.apply()
        });
    }

    apply() {
        if(this.pressedKeys.length == 0) {
            return;
        }
        var cardinalPoint = ["",""];
        for(var key of this.pressedKeys) {
            switch(key) {
                case "ArrowUp" :
                    cardinalPoint[0] = "n";
                    break;
                case "ArrowDown" :
                    cardinalPoint[0] = "s";
                    break;
                case "ArrowLeft" :
                    cardinalPoint[1] = "w";
                    break;
                case "ArrowRight" :
                    cardinalPoint[1] ="e";
                    break;
            }
        }

        cardinalPoint = cardinalPoint.join("");

        // if(this.pressedKeys.indexOf("Space") > -1) {
        //     this.character.jump();
        // }

        if(cardinalPoint) {
            this.character.move(cardinalPoint);
        }
    }
}