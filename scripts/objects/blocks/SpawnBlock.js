class SpawnBlock extends Block{
    constructor() {
        super(0x68be80);
        this.isSpawn = true;
    }
}

Block.types.push(() => new SpawnBlock());