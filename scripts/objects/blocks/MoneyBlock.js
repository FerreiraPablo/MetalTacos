class MoneyBlock extends Block {
    constructor() {
        super(0xffd866);
    }

    startPhysics() {
        var block = this;
        this.body.addEventListener("collide", function(event) {
            var collidedBody = event.body;
            if(collidedBody.mesh.isCharacter && !block.isConsumed) {
                var character = collidedBody.mesh;
                character.money += 5;
                block.isConsumed = true;
                block.building.removeBlock(block);
            }
        })
    }
}

Block.types.push(() => new MoneyBlock());