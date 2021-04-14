class MouseCharacterController extends CharacterController {
    lastCardinal = null;
    getCardinal(angle) {
        const degreePerDirection = 360 / 8;
        const offsetAngle = angle + degreePerDirection / 2;

        return (offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection) ? "sw" :
            (offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection) ? "s" :
            (offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection) ? "se" :
            (offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection) ? "e" :
            (offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection) ? "ne" :
            (offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection) ? "n" :
            (offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection) ? "nw" :
            "w";
    }
    constructor(character, scene) {
        super();
        var reference = this;
        scene.addEventListener("mousemove", function (event) {
            var mousePosition = event.intersection.point;
            var angle = (Math.atan2(character.position.x - mousePosition.x, character.position.z - mousePosition.z) * 180 / Math.PI) + 180;
            character.move(reference.getCardinal(angle))
        })

        scene.addEventListener("click", function() {
            character.jump();
        })
    }
}