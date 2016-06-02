//This is the car Class. 
var finalEntryPoints;

var Car = function (carPath) {
    var path = carPath;
    var pathIndex = 1;
    var prevIndex = pathIndex - 1;
    var dist = 0;
    this.carCoord = {};
    this.image = new Image();
    this.image.src = "resources/cars/taxi.png";

    prevIndex = goToEntry();
    pathIndex = prevIndex + 1;
    dist = initDist();
    this.angle = initAngle();
    this.carCoord['x'] = carPath[prevIndex]['x'];
    this.carCoord['y'] = carPath[prevIndex]['y'];



    //Functions



    function goToEntry() {

        var entry = Math.floor((Math.random() * 10)) % finalEntryPoints.length;
        return finalEntryPoints[entry];
    }

    function initDist() {
        //change dist
        dist = Math.sqrt((path[pathIndex]['x'] - path[prevIndex]['x']) * (path[pathIndex]['x'] - path[prevIndex]['x']) +
			(path[pathIndex]['y'] - path[prevIndex]['y']) * (path[pathIndex]['y'] - path[prevIndex]['y']));
        return dist;
    };

    function initAngle() {
        //change angle
        var angleY = path[pathIndex]['y'] - path[prevIndex]['y'];
        var angleX = path[pathIndex]['x'] - path[prevIndex]['x'];

        this.angle = Math.atan2(angleY, angleX) * (180 / Math.PI);

        if (this.angle < 0)
            this.angle = Math.abs(this.angle);
        else
            this.angle = 360 - this.angle;

        if (angleX > 0) {
            //if going to the right
            this.angle = 90 - this.angle;
        }
        else {
            this.angle = 360 + 90 - this.angle;
        }

        return this.angle;
    }

    this.move = function () {

        //change next Destination if car has arrived
        if (pathIndex < path.length) {
            var x = Math.round(this.carCoord['x']);
            var y = Math.round(this.carCoord['y']);
            //check if car is out of bounds
            if (x > 1200 || y > 1200 || y < 0 || x < 0) {
                prevIndex = goToEntry();
                pathIndex = prevIndex + 1;
                this.carCoord['x'] = path[prevIndex]['x'];
                // console.log(path[prevIndex]['x']); ------------------------------------
                this.carCoord['y'] = path[prevIndex]['y'];
                dist = initDist();
                this.angle = initAngle();
                return;
            }

            if (Math.abs(path[pathIndex]['x'] - x) <= 3 && Math.abs(path[pathIndex]['y'] - y) <= 3) {
                printToConsole('<br/ >Destination changed! ' + x + '_' + y);
                prevIndex = pathIndex;
                if (path[pathIndex]['branch'].length > 0) {
                    var pathJump = path[pathIndex]['branch'].length;
                    var randomPath = Math.floor((Math.random() * 10) % pathJump);
                    pathIndex = path[pathIndex]['branch'][randomPath];
                }
                else
                    pathIndex++;

                //if type is dead point, go to another point
                if (path[prevIndex]['type'] == 1 || pathIndex >= path.length) {
                    prevIndex = goToEntry();
                    pathIndex = prevIndex + 1;
                    this.carCoord['x'] = path[prevIndex]['x'];
                    // console.log(path[prevIndex]['x']); ----------------------------------
                    this.carCoord['y'] = path[prevIndex]['y'];
                    dist = initDist();
                    this.angle = initAngle();
                    return;
                }

                //change angle
                this.angle = initAngle();

                //change dist
                this.dist = initDist();
            }

            //move Car
            var velx = (path[pathIndex]['x'] - path[prevIndex]['x']) / dist;
            var vely = (path[pathIndex]['y'] - path[prevIndex]['y']) / dist;
            x = Math.floor(this.carCoord['x']);
            y = Math.floor(this.carCoord['y']);
            this.carCoord['x'] += velx;
            this.carCoord['y'] += vely;
        }
    }

    this.getFrontCoord = function () {
        var velx = (path[pathIndex]['x'] - path[prevIndex]['x']) / dist;
        var vely = (path[pathIndex]['y'] - path[prevIndex]['y']) / dist;
        x = Math.floor(this.carCoord['x']);
        y = Math.floor(this.carCoord['y']);
        var front = {};
        front['x'] = (x + (velx * 17));
        front['y'] = (y + (vely * 17));

        return front;
    }
};


var CarList = function(carPath, carEntry, trafficLight) {
	this.cars = []
	var tLights = trafficLight;
	var size = 0;
	var path = carPath;
   finalEntryPoints =carEntry;
	this.drawCars = function(canvas) {
		for (var i = 0; i < size; i++) {
			var image = this.cars[i].image;
			var x = Math.round(this.cars[i].carCoord['x']);
			var y = Math.round(this.cars[i].carCoord['y']);
			canvas.save();
			canvas.translate(x,y);
			canvas.rotate(this.cars[i].angle*(Math.PI / 180));
			canvas.drawImage(image,0,0,image.width,image.height,-10,-10,20,20);
			canvas.restore();
		}
	}

	this.createCars = function(userSize) {
		for (var i = 0; i < userSize; i++) {
			this.cars.push(new Car(path));
		}
		size = userSize;
	};

	this.moveCars = function() {
		for (var i = 0; i < size; i++) {
			var toMove = true;
			var checkPoints = this.cars[i].getFrontCoord();
			//collision
			for (var x = 0; x < size; x++) {
				if(checkPoints['x'] > this.cars[x].carCoord['x']-8 && 
					checkPoints['x'] < this.cars[x].carCoord['x']+8 &&
					checkPoints['y'] > this.cars[x].carCoord['y']-8 &&
					checkPoints['y'] < this.cars[x].carCoord['y']+8)
					toMove = false;
			}
			//traffic light
			for (var x = 0; x < tLights.length; x++) {
				var tLight = tLights[x];
				for (var y = 0; y < tLight['points'].length; y++) {
					var pointPair = tLight['points'][y];
					for (var z = 0; z < pointPair.length; z++) {
						if(pointPair[z]['x']+9 > this.cars[i].carCoord['x'] &&
							pointPair[z]['x']-9 < this.cars[i].carCoord['x'] &&
							pointPair[z]['y']+9 > this.cars[i].carCoord['y'] &&
							pointPair[z]['y']-9 < this.cars[i].carCoord['y'] &&
							!pointPair[z]['status']){
							toMove = false;
						}
							
					}
				}
			}
			if(toMove)
				this.cars[i].move();
		}
	}
};
