class SkyBlock extends Block{
    constructor() {
        super(0x6faef0);
    }
}

Block.types.push(() => new SkyBlock());