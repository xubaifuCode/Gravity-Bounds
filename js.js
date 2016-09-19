var moveBoundInterval, moveSlidInterval;
var isStart;
var left, right;
//The edges
var leftEdge, rightEdge, topEdge, bottomEdge;
//use it to decide direction
var directX, directY;
var myBound, mySlid, game_area;
function $(elemId) {
	return document.getElementById(elemId);
}

function startGame() {
	$("menu").style.display = "none";
	isStart = true;
	directX = directY = 3;
	game_area = $("game_area");

	topEdge = 140;
	bottomEdge = 300;
	leftEdge = game_area.offsetLeft;
	rightEdge = leftEdge + game_area.offsetWidth;


	myBound = new Ball();
	mySlid = new Slid();
	game_area.appendChild(myBound.getBall());
	game_area.appendChild(mySlid.getSlid());


	var tLeftP = leftEdge + parseInt((Math.random() * game_area.offsetWidth));
	tLeftP = tLeftP > rightEdge - mySlid.width() ? tLeftP - mySlid.width()  : tLeftP;

	mySlid.toPosition(tLeftP, 300);
	myBound.toPosition(tLeftP, 280);

	moveBoundInterval = setInterval("boundMove()", 30);
	moveSlidInterval = setInterval("slidMove()", 5);
}

function boundMove() {
	var bound = $("bound");
	myBound.toPosition(bound.offsetLeft + directX, bound.offsetTop + directY);
	
	if (!resetDirect(myBound.X(), myBound.Y())) {
		clearInterval(moveBoundInterval);
		clearInterval(moveSlidInterval);
		$("menu").style.display = "block";
		console.log("Game over.");
	}
}

function generateMap() {
	var box_area = $("box_area");
	var str = ""
	var maxBoxNum = 70;
	for (var i = 1; i <= maxBoxNum; i++) {
		str += "<span class=\"box\" id=\"box_" + i + "\"></span>"
	}
	box_area.innerHTML = str;
}

function slidMove() {
	var slid = $("slid");
	var p;
	if (left) {
		p = slid.offsetLeft - 2
		slid.style.left = p  < leftEdge ? leftEdge : p + "px";
	} else if (right) {
		p = slid.offsetLeft + 2
		slid.style.left = p + mySlid.width() > rightEdge ? rightEdge - mySlid.width() : p + "px";
	}
}

function resetDirect(mX, mY) {
	var slidRight = mySlid.X() + mySlid.width();
	if (mX < leftEdge || mX + myBound.width() > rightEdge) {
		directX *= -1;
	}
	if (mY < topEdge) {
		directY *= -1;
	} else if(mY + myBound.height() > bottomEdge && mX + myBound.width() >= mySlid.X() && mX <= slidRight) {
		directY *= -1;
	} else if (mY + myBound.height() > bottomEdge) {
		return false;
	}
	return true;
}

function Ball() {
	var bound = document.createElement("div");
	bound.setAttribute("id", "bound");

	var width = 20;
	var height = 20;

	this.toPosition = function(toX, toY) {
		bound.style.left = toX + "px";
		bound.style.top = toY + "px";
	}

	this.X = function() {
		return bound.offsetLeft;
	}

	this.Y = function() {
		return bound.offsetTop;
	}

	this.getBall = function() {
		return bound;
	}

	this.width = function() {
		return width;
	}

	this.height = function() {
		return height;
	}
}

function Slid() {
	var slid = document.createElement("div");
	slid.setAttribute("id", "slid");
	
	var width = 80;
	var height = 10;

	this.toPosition = function(toX, toY) {
		slid.style.left = toX + "px";
		slid.style.top = toY + "px";
	}

	this.X = function() {
		return slid.offsetLeft;
	}

	this.Y = function() {
		return slid.offsetTop;
	}

	this.width = function() {
		return width;
	}

	this.getSlid = function() {
		return slid;
	}
}

window.onkeydown = function() {
	var keyCode = event.keyCode - 38;
	switch(keyCode) {
		case -1:
			left = true && isStart;
			break;
		case 1:
			right = true && isStart;
			break;
	}
	//console.log("down left:" + left + ", " + right);
}

window.onkeyup = function() {
	var keyCode = event.keyCode - 38;

	switch(keyCode) {
		case -1:
			left = false;
			break;
		case 1:
			right = false;
			break;
	}
	//console.log("up left:" + left + ", " + right);
}