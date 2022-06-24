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
                        character.teleporting = true;
                        gsap.to(character.body.position, 0.25, {
                            x: randomBlock.position.x,
                            y: randomBlock.position.y + (Block.size * 2),
                            z: randomBlock.position.z,
                            onComplete: function() {
                                character.body.quaternion.set(0,0,0,1);
                                character.body.velocity.setZero();
                                character.body.angularVelocity.setZero();
                                character.body.force.setZero();
                                character.body.inertia.setZero();
                                character.teleporting = false;
                                character.body.wakeUp();
                                character.lastCollidedBlock = randomBlock;
                            }
                        });
                    }
                }
            }
        })
    }
}

Block.types.push(() => new RandomTeleportBlock());