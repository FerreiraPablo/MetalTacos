class MouseEventsInjector {
    constructor(renderer, camera, scene) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;

        document.body.onclick = x => this.trigger(x, "click");
        document.body.ondblclick = x => this.trigger(x, "dblclick");
        document.body.onmousemove = x => this.trigger(x, "mousemove");
        document.body.onmouseup = x => this.trigger(x, "mouseup");
        document.body.onmouseover = x => this.trigger(x, "mouseover");
        document.body.onmouseout = x => this.trigger(x, "mouseout");
        document.body.onmousedown = x => this.trigger(x, "mousedown");
    }

    getAllMeshes(element, array) {
        if (element.type == "Mesh" && element.children == 0) {
            array.push(element);
            return array;
        }
        for (var child of element.children) {
            if (child.type == "Group") {
                this.getAllMeshes(child, array);
                continue;
            }
            array.push(child);
        }
    }


    dispatch(eventData, threeObject) {
        threeObject.dispatchEvent(eventData);
        if(threeObject.parent) {
            this.dispatch(eventData,threeObject.parent);
        }
    }

    trigger(event, eventName) {
        var mouse = new THREE.Vector2();
        var raycaster = new THREE.Raycaster();
        var meshes = []
        mouse.x = (((event.clientX * this.renderer.getPixelRatio()) - this.renderer.domElement.offsetLeft) / this.renderer.domElement.width) * 2 - 1;
        mouse.y = -(((event.clientY * this.renderer.getPixelRatio()) - this.renderer.domElement.offsetTop) / this.renderer.domElement.height) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);
        this.getAllMeshes(this.scene, meshes);
        meshes.push(this.scene);
        var intersects = raycaster.intersectObjects(meshes);
        var intersection = intersects[0]
        if (intersection) {
            var data = { type: eventName, "intersection" : intersection};
            for(var property in event) {
                if(typeof event[property] == 'number' || typeof event[property] == 'string' || typeof event[property] == 'function') {
                    data[property] = event[property];
                }
            }
            this.dispatch(data, intersection.object);
        }
    }
}