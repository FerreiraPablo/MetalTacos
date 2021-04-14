THREE.GroupUtilities = {

}


THREE.GroupUtilities.getAllMeshes = function(threeObject, meshArray) {
    meshArray = meshArray || [];
    if (threeObject.type == "Mesh") {
        meshArray.push(threeObject);
    }
    for (var child of threeObject.children) {
        if (child.type == "Mesh") {
            meshArray.push(child);
        }

        if (child.children.length) {
            THREE.GroupUtilities.getAllMeshes(child, meshArray);
        }
    }
    return meshArray;
}


THREE.GroupUtilities.dispose = function(element) {
    if (!element) {
        return;
    }
    var meshes = [];
    THREE.GroupUtilities.getAllMeshes(element, meshes, (x => true));
    meshes.push(element);
    for (var child of meshes) {
        if (child.geometry) {
            child.geometry.dispose();
            child.geometry = null;
        }

        if (child.material) {
            child.material.dispose();
            child.material = null;
        }


        if (child.texture) {
            child.texture.dispose();
            child.texture = null;
        }

        if (child.children) {
            child.children.forEach(THREE.GroupUtilities.dispose);
        }

        if (child.parent) {
            child.parent.remove(child);
        }
        child.uuid = null;
    }
}

THREE.GroupUtilities.getBox = function(threeObject) {
    var threeObjectBox = new THREE.Box3();
    threeObjectBox.setFromObject(threeObject);
    return threeObjectBox;
}

THREE.GroupUtilities.getMax = function(threeObject) {
    return this.getBox(threeObject).max;
}

THREE.GroupUtilities.getMin = function(threeObject) {
    return this.getBox(threeObject).min;
}


THREE.GroupUtilities.getSize = function(threeObject) {
    var targetVector = new THREE.Vector3();
    this.getBox(threeObject).getSize(targetVector);
    return targetVector;
}

THREE.GroupUtilities.align = function(threeObject, parent, axis, direction, origin) {
    origin = origin || "center";
    var centerOffset = 0;
    if(origin != "center") {
        var objectOffset = this.getSize(threeObject)[axis] / 2;
        centerOffset = origin == "start" ? objectOffset : -objectOffset;
    }

    if(direction > 0) {
        var parentMax = parent.position[axis] + parent.worldToLocal(this.getMax(parent))[axis];
        threeObject.position[axis] = parentMax + centerOffset;
    }  else if (direction < 0) {
        var parentMin = parent.position[axis] + parent.worldToLocal(this.getMin(parent))[axis];
        threeObject.position[axis] = parentMin - centerOffset;
    } else {
        threeObject.position[axis] = parent.position[axis] - centerOffset;
    }
};


THREE.GroupUtilities.alignBottom = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "y", -1, origin);
}

THREE.GroupUtilities.alignTop = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "y", 1, origin);
}

THREE.GroupUtilities.alignCenterHeight = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "y", 0, origin);
}

THREE.GroupUtilities.alignLeft = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "x", -1, origin);
}

THREE.GroupUtilities.alignRight = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "x", 1, origin);
}

THREE.GroupUtilities.alignCenterWidth = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "x", 0, origin);
}


THREE.GroupUtilities.alignForward = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "z", 1, origin);
}

THREE.GroupUtilities.alignBackward = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "z", -1, origin);
}

THREE.GroupUtilities.alignCenterDepth = function(threeObject, parent, origin) {
    this.align(threeObject, parent, "z", 0, origin);
}

THREE.GroupUtilities.alignCenter = function(threeObject, parent, origin) {
    this.alignCenterDepth(threeObject, parent, origin)
    this.alignCenterWidth(threeObject, parent, origin)
    this.alignCenterHeight(threeObject, parent, origin)
}



THREE.GroupUtilities.merge = function(threeObject, otherThreeObject) {
    if(typeof otherThreeObject === 'function') {
        otherThreeObject = otherThreeObject(threeObject);
    }

    threeObject.updateMatrix();
    otherThreeObject.updateMatrix();
    threeObject.geometry.merge(otherThreeObject.geometry);


    threeObject.updateMatrix();
}

THREE.GroupUtilities.lastChild = function(threeObject) {
    return threeObject.children[threeObject.children.length-1];
}


THREE.GroupUtilities.firstChild = function(threeObject) {
    return threeObject.children[0];
}

THREE.GroupUtilities.extendObject = function(threeObject) {
    var reference = this;
    function generateMethodFunction(methodName) {
        return (function(... args) { 
            var defaultArgs = [this];
            if(args[0]) {
                if(!args[0].type) {
                    defaultArgs.push(this.parent || this.lastChained);
                } else {
                    this.lastChained = args[0];
                }
            }
            for(var arg of args) {
                defaultArgs.push(arg)
            }
            reference[methodName].apply(reference,defaultArgs);
            
            return reference[methodName].apply(reference,defaultArgs) || this;
        })
    }
    for(var method in reference ) {
        threeObject[method] = generateMethodFunction(method);
    }
    return threeObject;
}

THREE.GroupUtilities.Mesh = function(geometry, material, customProperties) {
    customProperties = customProperties || {};

    
    var mesh = new THREE.Mesh(geometry, material);
    
    for(var prop in customProperties) { 
        mesh[prop] = customProperties[prop];
    }
    this.extendObject(mesh);
    return mesh;
}

THREE.GroupUtilities.Group = function(customProperties) {
    var mesh = new THREE.Group();

    for(var prop in customProperties) { 
        mesh[prop] = customProperties[prop];
    }
    this.extendObject(mesh);
    return mesh;
}


THREE.GroupUtilities.extend = function(threeObject, customProperties) {
    for(var prop in customProperties) { 
        threeObject[prop] = customProperties[prop];
    }
    this.extendObject(threeObject);
    return threeObject;
}