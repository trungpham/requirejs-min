(function(scope){

    var modules = {};

    var dependencyQueue = [];

    var checkDependencies = function(dependencies){
        var found = [];
        var i;
        for (i = 0; i <dependencies.length; i++){
            if (dependencies[i] in modules) {
                found.push(modules[dependencies[i]])
            }

        }
        if (found.length == dependencies.length){
            return found;
        }
    };

    var require = function(dependencies, func){
        var _dependencies = checkDependencies(dependencies);
        if (_dependencies) {
            func.apply(window, _dependencies)
        }else{
            //queue it
            dependencyQueue.push({deps: dependencies, func: func});
        }
    };

    var define = function(moduleName, dependencies, func){


        require(dependencies, function(){

            modules[moduleName] = func.apply(window, arguments);

        });


        //dequeue
        var i;
        for (i=0; i< dependencyQueue.length; i++){
            var _deps = checkDependencies(dependencyQueue[i].deps);
            if (_deps){
                dependencyQueue[i].func.apply(window, _deps);
                dependencyQueue[i].done = true; //mark for deletion
            }
        }

        //cleanup
        var cleanedQueue = [];
        for (i=0; i< dependencyQueue.length; i++){
            if (dependencyQueue[i].done){
                delete dependencyQueue[i]; //hopefully it get picked up by the garbage collector
            }else{
                cleanedQueue.push(dependencyQueue[i]);
            }
        }
        delete dependencyQueue; //dereference the old array
        dependencyQueue = cleanedQueue;

    };

    scope.require = require;

    scope.define = define;

})(window);