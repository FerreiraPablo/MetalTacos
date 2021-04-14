// This controls everything about tha game physics, gravity, forces, and collisions.
var physics = new CannonPhysicsAdapter();

// This creates all the core requirements, as the renderer, camera and scene.
var core = new MetalTacosCore(document.body, physics);

// This adds mouseEvents to the 3D Renderer.
var mouseEventsInjector = new MouseEventsInjector(core.renderer, core.camera, core.scene)

// This creates a Building based on a tridimensional matrix, First Level being Y, Second Z, Third X
// The numbers represent a block type in the Block.types array. Being 1 the base block
//  This creates a building of one level of height, 4 width, 4 depth.
var building = new Building([
    [
        [1, 1, 1, 1 ],
        [1, 1, 1, 1 ],
        [1, 1, 1, 1 ],
        [1, 1, 1, 1 ]
    ]
], physics);


// We set the world building.
core.setBuilding(building)

// We create a base character.
var character = new Character(); 

// And we add him to the core game.
core.addCharacter(character, { isMe: true } );

// Here we can default character controllers.
var controller = new IsometricKeyboardCharacterController(character);


// And some decoration.
var lamp = new CeilingLamp();
lamp.position.y = 2;
core.scene.add(lamp);
