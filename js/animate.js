var testPoints = [];
var cars;
var timer = 0;
var auto3 = new tAutomata();
var auto4 = new fAutomata();
var finalEntryPoints = [];

function animate(){
	if(toAnimate){
		var canvas = document.getElementById('canvas').getContext('2d');
		canvas.clearRect(0,0,1200,1200);
		if(testTLight[0]["type"] == 0){
			
				auto3.drawTLight(canvas, testTLight[0]['points']);
		}
		else{
				auto4.drawTLight(canvas, testTLight[0]['points']);
		}
		cars.drawCars(canvas);
		canvas.save();
		cars.moveCars();
	}
	if(timer == 500){
		if(testTLight[0]['type'] == 0)
			testTLight[0]['points'] = auto3.doTraffic(testTLight[0]['points']);
		else if(testTLight[0]['type'] == 1)
			testTLight[0]['points'] = auto4.doTraffic(testTLight[0]['points']);
		timer = 0;
	}
	timer++;
	window.requestAnimationFrame(animate);
}

function startAnimation(){
	testPoints = path;
	cars = new CarList(testPoints, finalEntryPoints,testTLight);
	cars.createCars(100);
	window.requestAnimationFrame(animate);
}

function generateEntryPoint(){	
		var entryPoints = [];
		entryPoints.push(0);
		for (var i = 0; i < path.length; i++) {
			if(path[i]['type'] == 1 && i < path.length-1) {
				entryPoints.push(i+1);
			}
			if(path[i]['branch'].length > 0 && i < path.length-1 ) {
				entryPoints.push(i+1);
			}
		}
		var entryPointsToDelete = [];
		for (var i = 0; i < path.length;i++){
			for (var j = 0; j <entryPoints.length;j++){
				if(i == entryPoints[j]){
					for (var k = 0; k < path.length;k++) {
						var tmp = path[k]['branch'];

						for (var l = 0; l < tmp.length;l++) {
							var x = path[tmp[l]]['x'];
							var y = path[tmp[l]]['y'];
							if (path[i]['x']== x && path[i]['y']== y) {
								entryPointsToDelete.push(entryPoints[j]);
							}
						}
					}
				}
			}
		}

		var tmp = new Set();

		for (var i = 0; i < entryPointsToDelete.length ; i++) {
			tmp.add(entryPointsToDelete[i]);
		}

		for (var i = 0; i < entryPoints.length ; i++) {
			var isAdded = tmp.has(entryPoints[i]);
			
			if (!isAdded) {
				finalEntryPoints.push(entryPoints[i]);
				// console.log(entryPoints[i]);
			}
		}

		startAnimation();
	}
