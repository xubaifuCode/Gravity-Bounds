var moveBoundInterval, moveSlidInterval;
var isStart;
var left, right;
var minCrashEdge;
var directX = -2, directY = -2;
var myBound, mySlid, myGameArea;
var maxBoxNum;
var MAX;
var speed = 10;
var moveDis = 4;
var wid = 81, hei = 17;
var score;

function $(elemId) {
	return document.getElementById(elemId);
}

function startGame() {
	if ($("slid")) {
		mySlid.obj.remove();
		myBound.obj.remove();
	}

	speed = 10;
	score = 0;
	MAX = maxBoxNum = 10;
	isStart = true;
	$("show_something").style.display = "none";
	$("surplus").innerHTML = "surplus: " + maxBoxNum;
	$("speed").innerHTML = "speed: " + speed;
	$("score").innerHTML = "score: " + score;

	myGameArea = new GameArea();
	myBound = new Ball();
	mySlid = new Slid();
	myGameArea.obj.appendChild(myBound.obj);
	myGameArea.obj.appendChild(mySlid.obj);
	minCrashEdge = Math.ceil(maxBoxNum / 10) * 15 + myGameArea.getTop();
	generateMap();

	//Generated the position of slid and ball.
	var slidPosition = 0;
	while(slidPosition < myGameArea.getLeft() || slidPosition > myGameArea.getRight() - mySlid.getWidth()) {
		slidPosition = myGameArea.getLeft() + Math.floor(Math.random() * 666);
	}
	mySlid.toPosition(slidPosition, 320);
	myBound.toPosition(slidPosition, 300);

	//Start to move
	moveBoundInterval = setInterval("boundMove()", speed);
	moveSlidInterval = setInterval("slidMove()", speed);
}

function slidMove() {
	if (left) {
		var leftEdge = myGameArea.getLeft();
		var p = mySlid.getLeft() - moveDis;
		p = p  < leftEdge ? leftEdge : p;
		mySlid.horizontalMove(p);
	} else if (right) {
		var rightEdge = myGameArea.getRight();
		var p = mySlid.getRight() + moveDis;
		p = p > rightEdge ? rightEdge - mySlid.getWidth() : mySlid.getLeft() + moveDis;
		mySlid.horizontalMove(p);
	}
}

window.onkeydown = function() {
	var e = e || event;
       	var keyCode=e.keyCode||e.which||e.charCode;
	switch(keyCode) {
		case 37:
			left = true && isStart;
			break;
		case 39:
			right = true && isStart;
			break;
	}
}

window.onkeyup = function() {
	var e = e || event;
       	var keyCode=e.keyCode||e.which||e.charCode;
	switch(keyCode) {
		case 37:
			left = false;
			break;
		case 39:
			right = false;
			break;
	}
}

function boundMove() {
	myBound.toPosition(myBound.getLeft() + directX, myBound.getTop() + directY);
	if (!resetDirect()) {
		$("hint_info").innerHTML = "Game Over"
		console.log("Game over.");
	} else if (maxBoxNum == 0) {
		$("hint_info").innerHTML = "You Win"
		console.log("You win.");
	} else {
		return;
	}
	clearInterval(moveBoundInterval);
	clearInterval(moveSlidInterval);
	$("show_something").style.display = "block";
	$("menu").innerHTML = "again"
	$("box_area").innerHTML = "";
}

function resetDirect() {
	var bLeft = myBound.getLeft();
	var bRight = myBound.getRight();
	var bTop = myBound.getTop();
	var bBottom = myBound.getBottom();

	if (bLeft < myGameArea.getLeft() || bRight > myGameArea.getRight()) {
		directX *= -1;
	}

	if (bTop < myGameArea.getTop() || (bTop < minCrashEdge && isCrash())) {
		directY *= -1;
	} else if (bBottom> mySlid.getTop() && bRight >= mySlid.getLeft() && bLeft <= mySlid.getRight()) {
		directY *= -1;
	} else if (bBottom > mySlid.getTop()) {
		return false;
	}
	
	return true;
}

function isCrash() {
	var bTop = myBound.getTop() - myGameArea.getTop();
	var bBottom = bTop + myBound.getHeight();
	var bLeft = myBound.getLeft()  - myGameArea.getLeft();
	var bRight = bLeft + myBound.getWidth();

	var row = directY < 0 ? Math.ceil(bTop/ hei) - 1 : Math.ceil(bBottom / hei)  - 2;
	row = row < 0 ? 0 : row;
	var col = directX < 0 ? Math.ceil(bLeft / wid) : Math.ceil(bRight / wid);

	var position ="box_" + (row * 10 + col);
	var box = $(position);
	if (box != null && box.style.visibility != "hidden") {
		box.style.visibility = "hidden";
		maxBoxNum--;
		if (maxBoxNum % 5 == 0) {
			resetSpeed();
		}
		$("surplus").innerHTML = "surplus: " + maxBoxNum;
		score += (MAX - maxBoxNum) * 10 + Math.pow(5, 10 - speed);
		$("score").innerHTML = "score: " + score;
		return true;
	}
	return false;
}

function resetSpeed() {
	speed--;
	$("speed").innerHTML = "speed: " + speed;
	clearInterval(moveBoundInterval);
	clearInterval(moveSlidInterval);
	moveBoundInterval = setInterval("boundMove()", speed);
	moveSlidInterval = setInterval("slidMove()", speed);
}

function generateMap() {
	var box_area = $("box_area");
	var tObj;
	for (var i = 1; i <= maxBoxNum; i++) {
		tObj = new Brick("box_" + i);
		box_area.appendChild(tObj.obj);
	}
}

function GameArea() {
	this.createGameArea = BaseModel;
	this.createGameArea(null, null, null, $("game_area"));
	delete this.createGameArea;
}

function Ball() {
	this.createBall = BaseModel;
	this.createBall("div", null, "bound", null);
	delete this.createBall;
}

function Slid() {
	this.createSlid = BaseModel;
	this.createSlid("div", null, "slid", null);
	delete this.createSlid;
}

function Brick(id) {
	this.createBrick = BaseModel;
	this.createBrick("span", "box", id, null);
	delete this.createBrick;
}

function BaseModel(labelName, className, idName, tObj) {
	this.obj = tObj == null ? document.createElement(labelName) : tObj;
	if (className != null) {
		this.obj.setAttribute("class", className);
	}
	if (idName != null) {
		this.obj.setAttribute("id", idName);
	}

	this.getWidth = function() {
		return this.obj.offsetWidth;
	}

	this.getHeight = function() {
		return this.obj.offsetHeight;
	}

	this.getLeft = function() {
		return this.obj.offsetLeft;
	}

	this.getRight = function() {
		return this.obj.offsetLeft + this.obj.offsetWidth;
	}

	this.getTop = function() {
		return this.obj.offsetTop;
	}

	this.getBottom = function() {
		return this.obj.offsetTop + this.obj.offsetHeight;
	}

	this.horizontalMove = function(toX) {
		this.obj.style.left = toX + "px";
	}

	this.verticalMove = function(toY) {
		this.obj.style.top = toY + "px";
	}

	this.toPosition = function(toX, toY) {
		this.obj.style.left = toX + "px";
		this.obj.style.top = toY + "px";
	}
}