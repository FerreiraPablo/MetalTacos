class JumpBlock extends Block {
    constructor() {
        super(0x8c77c4);
    }

    startPhysics() {
        this.body.addEventListener("collide", function(event) {
            var collidedBody = event.body;
            if(collidedBody.mesh.isCharacter) {
                collidedBody.mesh.jump();
            }
        })
    }
}

Block.types.push(() => new JumpBlock());