class GrassBlock extends Block {
    constructor() {
        super(0x50B397);
    }
}

Block.types.push(() => new GrassBlock());