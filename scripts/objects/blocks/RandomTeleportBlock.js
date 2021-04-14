class RandomTeleportBlock extends Block {
    isRandomTeleportBlock = true;
    constructor() {
        super(0x0892d0);
    }

    startPhysics() {
        var reference = this;
        this.body.addEventListener("collide", function(event) {
            if(reference.building) {
                var collidedBody = event.body;
                if(collidedBody.mesh.isCharacter) {
                    var character = collidedBody.mesh;
                    if(character.teleporting || character.lastCollidedBlock == reference) {
                        return false;
                    }
                    var randomBlocks = reference.building.blocks.filter(x => x.isRandomTeleportBlock && x.uuid != reference.uuid);
                    if(randomBlocks.length) {
                        var randomBlock = randomBlocks[Math.floor(Math.random() * randomBlocks.length)];
                        character.body.sleep();
                        character.body.position.set(randomBlock.position.x, randomBlock.position.y + (Block.size * 2), randomBlock.position.z);
                        // character.body.quaternion.set(0,0,0,1);
                        // character.body.velocity.setZero();
                        // character.body.angularVelocity.setZero();
                        // character.body.force.setZero();
                        // character.body.inertia.setZero();
                        character.body.wakeUp();
                        character.teleporting = true;
                        setTimeout(function() {
                            character.teleporting = false;
                        }, 500, character)
                    }
                }
            }
        })
    }
}

Block.types.push(() => new RandomTeleportBlock());