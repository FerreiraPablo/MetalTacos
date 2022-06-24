// This controls everything about tha game physics, gravity, forces, and collisions.
var physics = new CannonPhysicsAdapter();

// This creates all the core requirements, as the renderer, camera and scene.
var core = new MetalTacosCore(document.body, physics);

// This adds mouseEvents to the 3D Renderer.
var mouseEventsInjector = new MouseEventsInjector(core.renderer, core.camera, core.scene)

// This creates a Building based on a tridimensional matrix, First Level being Y, Second Z, Third X
// The numbers represent a block type in the Block.types array. Being 1 the base block
//  This creates a building of one level of height, 4 width, 4 depth.
var floors = 1;
var size = 8;
var buildingBlocks = [
    [   
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    ],
    [   
        [0, 1, 0, 1, 3, 3, 1, 0, 1, 1, 0],
        [1, 5, 1, 1, 1, 1, 1, 1, 1, 5, 1],
        [4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [3, 1, 4, 1, 1, 2, 1, 1, 4, 1, 3],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [4, 1, 1, 1, 1, 4, 1, 1, 1, 1, 4],
        [1, 5, 1, 1, 1, 1, 1, 1, 1, 5, 1],
        [0, 1, 0, 1, 3, 3, 1, 0, 1, 1, 0]
    ]
];

// for(var y=0; y < floors; y++) {
//     var floor = [];
//     for(var x=0; x < size; x++) {
//         var wall = [];
//         for(var z = 0; z < size; z++) {
//             wall.push(1)
//         }
//         floor.push(wall)
//     }
//     buildingBlocks.push(floor)
// }



var building = new Building(buildingBlocks, physics);


// We set the world building.
core.setBuilding(building)

// We create a base character.
var character = new Character(); 

// And we add him to the core game.
core.addCharacter(character, { isMe: true } );


var secondCharacter = new Character();
core.addCharacter(secondCharacter, { isMe: false });

// Here we can default character controllers.
var controller = new KeyboardCharacterController(character);
new MouseCharacterController(secondCharacter, core.scene);


// And some decoration.
var lamp = new CeilingLamp();
lamp.position.y = 2;
core.scene.add(lamp);

setInterval(function() {
    var characters = core.characters.sort((a,b) => a.score - b.score);
    var scoreBoard = document.querySelector(".score-list");
    scoreBoard.innerHTML = "";

    for(var character of characters) {
        var userScore = document.createElement("li");
        scoreBoard.append(userScore);
        userScore.innerHTML = character.name + " : " + character.score;
        userScore.style.color = toColor(character.color);
    }
}, 1000 / 60);

function toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
    return "rgba(" + [r, g, b, 1].join(",") + ")";
}