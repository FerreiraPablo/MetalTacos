class DirtBlock extends Block {
    constructor() {
        super(0x5C332C);
    }
}

Block.types.push(() => new DirtBlock());