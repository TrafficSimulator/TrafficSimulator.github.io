var tPoint = function(x, y){
	this.x = x;
	this.y = y;
	this.status = true;
};

//type == 0 is Three-way automata
//type == 1 is Four-way automata
var tLight = function(x, y){
	this.locX = [];
	this.locY = [];
    this.points = [];
    this.type = 0;
};

//JSON = "[{"points":[[{"x":10,"y":10}],[{"x":10,"y":10}],[{"x":10,"y":10}]], "type":0]},]"
// var testTLight = [{"points":[[{"x":446, "y":218, "status":true},],[{"x":420, "y":242, "status":false},],[{"x":483, "y":250, "status":true},]], "type":0},];
var testTLight = [{"points":[
[{"x":513,"y":349,"status":true},{"x":522,"y":361,"status":true},{"x":532,"y":372,"status":true},{"x":541,"y":383,"status":true}],
[{"x":452,"y":471,"status":false},{"x":460,"y":483,"status":false},{"x":469,"y":495,"status":false},{"x":479,"y":506,"status":false}],
[{"x":547,"y":469,"status":false},{"x":559,"y":463,"status":false},{"x":571,"y":457,"status":false}]
], "type":0},];
// [{"x":88,"y":108,"status":false},{"x":78,"y":120,"status":false}],
// [{"x":36,"y":138,"status":false},{"x":28,"y":122,"status":false}]
// [{"x":74,"y":34,"branch":[],"type":0},{"x":88,"y":48,"branch":[],"type":0}
// {"x":90,"y":114,"branch":[],"type":0},{"x":78,"y":126,"branch":[],"type":0}
// {"x":28,"y":142,"branch":[],"type":0},{"x":18,"y":130,"branch":[],"type":0}]


//Three-way Automata
var tAutomata = function() {

	this.drawTLight = function(canvas, points) {
		for (var i = points.length - 1; i >= 0; i--) {
			var lane = points[i];
			for (var j = lane.length - 1; j >= 0; j--) {
				var x = lane[j]['x'];
				var y = lane[j]['y'];
				var color;

				if(lane[j]['status'])
					color = "green";
				else
					color = "red";

				canvas.beginPath();
				canvas.arc(x,y,10,0,2*Math.PI);
				canvas.fillStyle = color;
				canvas.fill();
			}
		}
	}

	this.doTraffic = function(points) {
		if(points[0][0]['status'] && !points[1][0]['status'] && !points[2][0]['status']){
			console.log('x');
			for (var i = 0; i < points[0].length; i++) {
				points[0][i]['status'] = false;
			}
			for (var i = 0; i < points[1].length; i++) {
				points[1][i]['status'] = true;
			}
			for (var i = 0; i < points[2].length; i++) {
				points[2][i]['status'] = false;
			}
		}
		else if(!points[0][0]['status'] && points[1][0]['status'] && !points[2][0]['status']){
			console.log('y');
			for (var i = 0; i < points[0].length; i++) {
				points[0][i]['status'] = false;
			}
			for (var i = 0; i < points[1].length; i++) {
				points[1][i]['status'] = false;
			}
			for (var i = 0; i < points[2].length; i++) {
				points[2][i]['status'] = true;
			}
		}
		else if(!points[0][0]['status'] && !points[1][0]['status'] && points[2][0]['status']){
			console.log('z');
			for (var i = 0; i < points[0].length; i++) {
				points[0][i]['status'] = true;
			}
			for (var i = 0; i < points[1].length; i++) {
				points[1][i]['status'] = false;
			}
			for (var i = 0; i < points[2].length; i++) {
				points[2][i]['status'] = false;
			}
		}
		//experimental
		


		return points;
	};
};

var fAutomata = function() {

	this.drawTLight = function(canvas, points) {
		console.log(points.length);
		for (var i = points.length - 1; i >= 0; i--) {
			var lane = points[i];
			for (var j = lane.length - 1; j >= 0; j--) {
				var x = lane[j]['x'];
				var y = lane[j]['y'];
				var color;

				if(lane[j]['status'])
					color = "green";
				else
					color = "red";

				canvas.beginPath();
				canvas.arc(x,y,10,0,2*Math.PI);
				canvas.fillStyle = color;
				canvas.fill();
			}
		}
	}

	this.doTraffic = function() {
		if(points[0][0]['status'] && !points[1][0]['status'] && !points[2][0]['status'] && !points[3][0]['status']){
			//horizontal
			for (var i = 0; i < points[0].length; i++) {
				points[0][i]['status'] = false;
			}
			for (var i = 0; i < points[1].length; i++) {
				points[1][i]['status'] = true;
			}
			for (var i = 0; i < points[2].length; i++) {
				points[2][i]['status'] = false;
			}
			for (var i = 0; i < points[3].length; i++) {
				points[3][i]['status'] = false;
			}
		}
		else if(!points[0][0]['status'] && points[1][0]['status'] && !points[2][0]['status'] && !points[3][0]['status']){
			//vertical
			for (var i = 0; i < points[0].length; i++) {
				points[0][i]['status'] = false;
			}
			for (var i = 0; i < points[1].length; i++) {
				points[1][i]['status'] = false;
			}
			for (var i = 0; i < points[2].length; i++) {
				points[2][i]['status'] = true;
			}
			for (var i = 0; i < points[3].length; i++) {
				points[3][i]['status'] = false;
			}
		}
		else if(!points[0][0]['status'] && !points[1][0]['status'] && points[2][0]['status'] && !points[3][0]['status']){
			//cross-1
			for (var i = 0; i < points[0].length; i++) {
				points[0][i]['status'] = false;
			}
			for (var i = 0; i < points[1].length; i++) {
				points[1][i]['status'] = false;
			}
			for (var i = 0; i < points[2].length; i++) {
				points[2][i]['status'] = false;
			}
			for (var i = 0; i < points[3].length; i++) {
				points[3][i]['status'] = true;
			}
		}
		else if(!points[0][0]['status'] && !points[1][0]['status'] && !points[2][0]['status'] && points[3][0]['status']){
			//cross-2
			for (var i = 0; i < points[0].length; i++) {
				points[0][i]['status'] = true;
			}
			for (var i = 0; i < points[1].length; i++) {
				points[1][i]['status'] = false;
			}
			for (var i = 0; i < points[2].length; i++) {
				points[2][i]['status'] = false;
			}
			for (var i = 0; i < points[3].length; i++) {
				points[3][i]['status'] = false;
			}
		}
	};
};