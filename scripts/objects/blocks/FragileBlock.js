class FragileBlock extends Block {
    constructor() {
        super(0xFF6347);
    }

    startPhysics() {
        this.body.addEventListener("collide", function(event) {
            var collidedBody = event.body;
            if(collidedBody.mesh.isCharacter) {
                var reference = this.mesh;
                if(!reference.isFalling) {
                    this.mass = 3;
                    this.collisionResponse = 0;
                    this.type = CANNON.Body.DYNAMIC;
                    this.updateMassProperties();
                    reference.isFalling = true;
                }
            }
        })
    }
}


Block.types.push(() => new FragileBlock());