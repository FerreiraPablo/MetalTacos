class GrassBlock extends Block{
    constructor() {
        super(0x68be80);
    }
}

Block.types.push(() => new GrassBlock());