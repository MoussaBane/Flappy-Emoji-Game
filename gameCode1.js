var myGamePiece;
var myObstacles = [];
var myScore;
var myGameSound;
var myGameOverSound;

function startGame() {
    myBackGround = new component(700, 500,"GameImages/backGround.jpg",0,0,"background");
    myGamePiece = new component(35, 35, "GameImages/gamePieceFirst.jpg", 10, 175,"image");
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Arial Black", "black", 450, 470, "text");
    myMark = new component("20px", "Arial Black" , "black", 430 , 500, "text");
    myGameName = new component("30px","Arial Black","black",10,495,"text");
    myFloor = new component(700, 60, "GameImages/floor.jpg", 0, 440, "image");

    myGameOverSound = new myGameSounds("GameSounds/gameOverSound.mp3");
    myGameSound = new myGameSounds("GameSounds/gameSound.mp3");

    myGameArea.start();

}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 700;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 15);

        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        contex = myGameArea.context;
        if (this.type == "text") {
            contex.font = this.width + " " + this.height;
            contex.fillStyle = color;
            contex.fillText(this.text, this.x, this.y);
        } else if(this.type == "image" || this.type == "background"){
            this.image = new Image();
            this.image.src = color;
            contex.drawImage(this.image,this.x,this.y,this.width,this.height);
            if(this.type == "background"){
                contex.drawImage(this.image,this.x + this.width,this.y,this.width,this.height);
            }
        } else {
            contex.fillStyle = color;
            contex.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if(this.type == "background"){
            if(this.x == -(this.width)){
                this.x = 0;
            }
        }
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - myFloor.height;
        if (this.y > rockbottom) {
            this.y = rockbottom - myFloor.height;
            this.gravitySpeed = 0;
        }
        if(this.y < 0){
            this.y = this.height;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {

    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameOverSound.play();
            myGameSound.stop();
            return;
        } 
    }

    myGameSound.play();

    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(20, height, "GameImages/northObstacle.jpg", x/2 , 0,"image"));
        myObstacles.push(new component(20, x - height - gap - myFloor.height , "GameImages/southObstacle.jpg", x/2 , height + gap ,"image"));
    }

    myBackGround.speedX = -1;
    myBackGround.newPos();
    myBackGround.update();

    for (i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    myFloor.newPos();
    myFloor.update();

    myGamePiece.newPos();
    myGamePiece.update();

    myScore.text="SCORE: " + (myGameArea.frameNo - myGamePiece.x);
    myScore.update();

    myMark.text="BY MOUSSA BANE 'MB'";
    myMark.update();

    myGameName.text = "Flappy Emoji Game";
    myGameName.update();

    if((myGameArea.frameNo - myGamePiece.x) >= 4000){
        this.interval = setInterval(updateGameArea, 14);
    }
    
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

function myGameSounds(src){
    this.myGameSounds = document.createElement("audio");
    this.myGameSounds.src = src;
    this.myGameSounds.setAttribute("preload","audio");
    this.myGameSounds.setAttribute("controls","none");
    this.myGameSounds.style.display = "none";
    document.body.appendChild(this.myGameSounds);
    this.play = function(){
        this.myGameSounds.play();
    }
    this.stop = function(){
        this.myGameSounds.pause();
    }
}

function accelerate(n) {
    myGamePiece.gravity = n;
}