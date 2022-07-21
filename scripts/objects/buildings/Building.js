class Building extends THREE.Group {
    blockSize = 0.3;
    margin = 0.01

    constructor(structure, physics) {
        super();
        this.physics = physics;
        this.blocks = [];
        if(structure && structure.length) {
            this.structure = structure;
            this.render();
        } else {
            this.load();
        }
    }


    save() {
        localStorage.setItem("map", JSON.stringify(this.structure));
    }

    load() {
        if(localStorage["map"]) {
            this.structure = JSON.parse(localStorage["map"]);
            this.render();
        }
    }

    render() {
        this.blocks.forEach(THREE.GroupUtilities.dispose)
        var structure = this.structure;
        this.calculate(structure);
        for (var y in structure) {
            for (var z in structure[y]) {
                for (var x in structure[y][z]) {
                    if (structure[y][z][x]) {
                        let block = this.getBlock(structure[y][z][x]);
                        if (block) {
                            block.name = x + "x" + y + "x" + z;
                            block.position.x = (x * Block.size) - (this.maxWidth / 2);
                            block.position.y = (y * Block.size);
                            block.position.z = (z * Block.size) - (this.maxDepth / 2);
                            block.x = parseInt(x);
                            block.y = parseInt(y);
                            block.z = parseInt(z);
                            this.add(block);
                            this.blocks.push(block);
                            block.setPhysics(this.physics);
                            block.building = this;
                        }
                    }
                }
            }
        }
    }
    calculate(structure) {
        this.maxHeight = structure.length * Block.size;
        this.maxDepth = 0;
        this.maxWidth = 0;
        for (var y in structure) {
            for (var z in structure[y]) {
                if(structure[y].length > this.maxDepth) {
                    this.maxDepth = structure[y].length * Block.size;
                }
                for (var x in structure[y][z]) {
                    if(structure[y][z].length > this.maxWidth) {
                        this.maxWidth = structure[y][z].length * Block.size;
                    }
                }
            }
        }
    }


    removeBlock(position) {
        this.structure[position.y][position.z][position.x] = 0;
        this.render();
        this.save();
    }

    addBlock(blockId, position) {
        if(position.y < 0){
            this.structure.unshift([]);
            position.y = 0;
        }
        while(this.structure.length <= position.y) {
            this.structure.push([]);
        }


        var selectedHeight = this.structure[position.y];

        if(position.z < 0){
            selectedHeight.unshift([]);
            position.z = 0;
        }
        while(selectedHeight.length <= position.z) {
            selectedHeight.push([]);
        }

        var selectedDepth = selectedHeight[position.z];

        if(position.x < 0){
            selectedDepth.unshift(0);
            position.x = 0;
        }
        while(selectedDepth.length <= position.x) {
            selectedDepth.push(0);
        }
        selectedDepth[position.x] = blockId;
        this.render();
        this.save();
    }

    getBlock(type) {
        if (Block.types[type]) {
            var block = Block.types[type]();
            return block;
        }
        return null;
    }
}