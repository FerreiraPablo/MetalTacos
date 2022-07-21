class Block extends THREE.Group {
    isBlock = true;
    constructor(color, size) {
        super()
        size = size || Block.size;
        var geometry = new THREE.BoxGeometry(size, size, size);
        var material =  typeof color === 'undefined' ? Block.DefaultMaterial : new THREE.MeshPhongMaterial({
            color : color,
            transparent: true,
            depthWrite: true
        });

        this.block = new THREE.Mesh(geometry, material);
        this.block.castShadow = true;
        this.block.receiveShadow = true;
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
        if(!physics)
            return;
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

Block.DefaultMaterial = new THREE.MeshPhongMaterial({
    color : 0xc2bcb7,
    depthWrite: true
});

Block.size = 0.3;
Block.types = [
    null,
    () => new Block()
];