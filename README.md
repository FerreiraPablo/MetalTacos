# MetalTacos
A game made for anyone and by anyone.

## What to know?
This a full game based totally on JavaScript. Without any external dependency so it can be worked in any environment with any text editor. 

### Objective
Make a project than can evolve based on creativity, anyone can contribute and make the game more fun in anyway. By giving features based on experimentation.

### Rules 
Try to use the actual game standards is a really common structure of a Web Project. By reading a class is easy to get, properties/variables in camelCase, and classes in PascalCase. If a class extends a project class (E. Light) the created class must be "GreenLight" having the base class in the end.

But for references : 
[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html#features-classes)

### Gettin' Started
If you want to create a feature, you're welcome to do it. Just clone develop and create you own feature/* branch. In there you're free to make anything to challenge yourself and make this community based proyect better.

You can use any text editor that you like, we recomend :
[Visual Studio Code](https://code.visualstudio.com/)

#### The insight
The game is divided in different JavaScript Classes, in a kind of modular Way, any new class needs to be added to the index.html

Actual game elements : 
**Core**: The core contains the main game logic and the settings of the scene. And is the one that updates the renderer.

We have libs that are external libraries some of the included at the day of this documentation are : 
[THREE.js](https://threejs.org/) A library for 3D in javascript.
[CANNON.js](https://schteppe.github.io/cannon.js/) A javascript physics engine.
[GSAP.js](https://greensock.com/) A library to animate and interpolate numeric values.

We also have objects, that all of them extend from THREE.Group, this are 3D Elements that can be added to the scene. 
**Character**: A character duh...
**Building**: A tridimensional structure based on blocks.
**Block**: The main construction element of a building, can have different properties and interact with anything.
Lights, etc... Anything you want to do that will be visible in the world and can interact with the scene or the user.

