var moveBoundInterval, moveSlidInterval;
var isStart;
//recording when key was pressed.
var left, right;
//The edges
var leftEdge, rightEdge, topEdge, bottomEdge;
//use it to decide direction
var directX, directY;
var myBound, mySlid, game_area;
var maxBoxNum;
function $(elemId) {
	return document.getElementById(elemId);
}

function startGame() {
	if ($("slid")) {
		game_area.removeChild(mySlid.obj);
		game_area.removeChild(myBound.obj);
	}
	$("show_welcome").style.display = "none";
	maxBoxNum = 70;
	generateMap();
	isStart = true;
	directX = directY = -2;

	game_area = $("game_area");
	myBound = new Ball();
	mySlid = new Slid();
	game_area.appendChild(myBound.obj);
	game_area.appendChild(mySlid.obj);

	leftEdge = game_area.offsetLeft;
	rightEdge = leftEdge + game_area.offsetWidth;
	topEdge = 140;

	//Generated the position of slid and ball.
	var tLeftP = 0;
	while(tLeftP < leftEdge || tLeftP > (rightEdge - 100)) {
		tLeftP = leftEdge + Math.floor(Math.random() * game_area.offsetWidth);
	}

	mySlid.toPosition(tLeftP, 320);
	myBound.toPosition(tLeftP, 300);
	
	bottomEdge = mySlid.getTop();

	//Start to move
	moveBoundInterval = setInterval("boundMove()", 30);
	moveSlidInterval = setInterval("slidMove()", 5);
}

function boundMove() {
	myBound.toPosition(myBound.getLeft() + directX, myBound.getTop() + directY);

	if (!resetDirect(myBound.getLeft(), myBound.getTop())) {
		clearInterval(moveBoundInterval);
		clearInterval(moveSlidInterval);
		$("show_welcome").style.display = "block";
		$("menu").innerHTML = "again"
		$("box_area").innerHTML = "";
		console.log("Game over.");
	}
}

function generateMap() {
	var box_area = $("box_area");
	var tObj;
	for (var i = 1; i <= maxBoxNum; i++) {
		tObj = new Brick("box_" + i);
		box_area.appendChild(tObj.obj);
	}
}



function slidMove() {
	if (left) {
		var p = slid.offsetLeft - 3;
		p = p  < leftEdge ? leftEdge : p;
		mySlid.horizontalMove(p);
	} else if (right) {
		var p = slid.offsetLeft + 3;
		p = p + mySlid.getWidth() > rightEdge ? rightEdge - mySlid.getWidth() : p;
		mySlid.horizontalMove(p);
	}
}

function resetDirect(mX, mY) {
	if (mY < topEdge - 5) {
		return isCrash();
	}

	if (mX < leftEdge || mX + myBound.getWidth() > rightEdge) {
		directX *= -1;
	}

	if (mY < 20) {
		directY *= -1;
	}  else if (mY + myBound.getHeight() > bottomEdge && mX + myBound.getWidth() >= mySlid.getLeft() && mX <= mySlid.getRight()) {
		directY *= -1;
	} else if (mY + myBound.getHeight() > bottomEdge) {
		return false;
	}
	return true;
}

function isCrash() {
	var bLeft = myBound.getLeft()  - game_area.offsetLeft;
	var bRight = bLeft + myBound.getWidth();

	var row = directY < 0 ? Math.floor(myBound.getTop() / 17) - 1 : Math.floor(myBound.getBottom() / 17)  - 2;
	var col = directX < 0 ? Math.ceil(bLeft / 80) : Math.ceil(bRight / 80);
	console.log("Row:" + row + ", Col:" + col);
	var position ="box_" + (row * 10 + col);
	//console.log(position);
	if ($(position).style.visibility != "hidden") {
		$(position).style.visibility = "hidden";
		//directX *= -1;
		directY *= -1;
		maxBoxNum--;
	}
	return maxBoxNum != 0;
}

function Ball() {
	this.createBall = BaseModel;
	this.createBall("div", null, "bound");
	delete this.createBall;
}

function Slid() {
	this.createSlid = BaseModel;
	this.createSlid("div", null, "slid");
	delete this.createSlid;
}

function Brick(id) {
	this.createBrick = BaseModel;
	this.createBrick("span", "box", id);
	delete this.createBrick;
	this.isInArea = function(bLeft, bRight, bTop, bBottom) {
		console.log(bLeft + "" + bRight + "" + bTop + "" + bBottom);
		console.log(this.obj.id);
	}
}

function BaseModel(labelName, className, idName) {
	this.obj = document.createElement(labelName);
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