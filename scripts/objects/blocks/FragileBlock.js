class FragileBlock extends Block {
    constructor() {
        super(0xFF6347);

        setInterval(function (reference) {
            if (reference.isFalling && reference.body.position.y < -10) {
                console.log(reference.body.position.y);
                reference.reset();
            }
        }, 1000, this)
    }

    reset() {
        var reference = this;
        if (reference.originalPosition) {
            reference.isFalling = false;
            reference.body.sleep();
            reference.body.position.set(reference.originalPosition.x, 5, reference.originalPosition.z)
            reference.body.quaternion = reference.originalQuaternion;
            reference.originalQuaternion = null;
            reference.body.mass = 0;
            reference.body.type = CANNON.Body.STATIC;
            reference.body.updateMassProperties();
            
            reference.block.scale.set(0,0,0);
            gsap.to(reference.block.scale, 0.9, {
                x : 1,
                y : 1,
                z : 1,
                ease: Expo.easeInOut
            })

            gsap.to(reference.body.position, 1, {
                y: reference.originalPosition.y,
                x : reference.originalPosition.x,
                z : reference.originalPosition.z,
                ease: Expo.easeInOut,
                onComplete: function () {
                    reference.originalPosition = null;
                    reference.body.wakeUp();
                }
            })
        }
    }

    startPhysics() {
        this.body.addEventListener("collide", function (event) {
            var collidedBody = event.body;

            if (collidedBody.mesh.isCharacter) {
                var reference = this.mesh;
                if (!reference.isFalling) {
                    if (!reference.originalPosition) {
                        reference.originalPosition = this.position.clone();
                        reference.originalQuaternion = this.quaternion.clone();
                    }
                    this.mass = 0.25;
                    this.type = CANNON.Body.DYNAMIC;
                    this.updateMassProperties();
                    reference.isFalling = true;
                }
            }
        })
    }
}


Block.types.push(() => new FragileBlock());