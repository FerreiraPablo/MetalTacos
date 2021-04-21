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
        [2, 4, 4, 4, 4, 4, 4, 4, 4, 2],
        
        [2, 4, 3, 4, 4, 4, 4, 4, 3, 2],
        
        [2, 4, 4, 4, 4, 4, 4, 4, 5, 2],
        
        [2, 5, 4, 4, 4, 4, 4, 4, 4, 2],
        
        [2, 4, 3, 4, 4, 4, 4, 4, 4, 2],
        
        [2, 4, 4, 4, 4, 4, 4, 4, 4, 2],

    ]
], physics);


// We set the world building.
core.setBuilding(building)



// Here we can default character controllers.


// And some decoration.
var lamp = new CeilingLamp();
lamp.position.y = 2;
core.scene.add(lamp);



var server = new GlobalGameServerConnector("https://ferreirapablo.com", 4921);

server.addEventListener("login sucesss", function (user) {
    this.enterRoom("potato");


    var myCharacter = new Character();
    core.addCharacter(myCharacter, {
        isMe: user.id == server.id,
    });
    myCharacter.respawn();
    myCharacter.setServer(server);
    var controller = new IsometricKeyboardCharacterController(myCharacter);
    

    core.character.addEventListener("respawn", function(event) {
        server.updateProperty("position", event.respawnPoint);
        server.updateProperty("quaternion", new CANNON.Quaternion(0,0,0,1));
    });

    this.addEventListener("user gone", function (user) {
        var character = core.characters.filter(x => x.user == user)[0];
        if (character) {
            character.destroy();
        }
    })

    this.addEventListener("user joined", function (user) {
        var character = new Character();
        core.addCharacter(character, {
            user: user
        });

        myCharacter.sendUpdate();
        var remoteController = new RemoteCharacterController(character, user);;
        remoteController.updateCharacter();
    })
})
