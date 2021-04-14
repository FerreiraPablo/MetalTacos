class Block extends THREE.Group {
    isBlock = true;
    constructor(color) {
        super()
        var geometry = new THREE.BoxGeometry(Block.size, Block.size, Block.size);
        var material = new THREE.MeshPhongMaterial({
            color : typeof color === 'undefined' ? 0x222222 : color
        });
        this.block = new THREE.Mesh(geometry, material);
        this.block.castShadow = true;
        this.block.recieveShadow = true;
        this.add(this.block);


        this.addEventListener("click", function(event) {
            // if(this.building) {
            //     var additionPosition = event.intersection.face.normal;
            //     additionPosition.x += this.x;
            //     additionPosition.y += this.y;
            //     additionPosition.z += this.z;
            //     this.building.addBlock(1, additionPosition);
                
            // }
        })
    } 


    get color() { 
        return this.block.material.color.getHex()
    }

    set color(value) { 
        return this.block.material.color.setHex(value)
    }

    setPhysics(physics) {
        physics.addRigidBody(this)

        if(this.startPhysics) {
            this.startPhysics();
        }
        this.body.addEventListener("collide", function(event){
            var collidedMesh = event.body.mesh;
            if(collidedMesh.isCharacter) {
                collidedMesh.lastCollidedBlock = this.mesh;
            }
        })
    }
}

Block.size = 0.3;
Block.types = [
    null,
    () => new Block()
];