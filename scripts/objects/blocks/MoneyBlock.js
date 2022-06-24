class MoneyBlock extends Block {
    constructor() {
        super(0xffd866, 0.05);
        this.block.material.opacity = 0;

        var coin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 20), new THREE.MeshPhongMaterial({
            color : 0xffff00,
            shininess: 100
        }));

        this.block.add(coin);
        coin.rotation.x = Math.PI / 2;

        setInterval((block) => {
            block.block.rotation.y += 0.05;
            //block.block.rotation.x += 0.05;
        }, 1000 / 60, this);
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