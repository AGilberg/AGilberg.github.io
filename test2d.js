var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var posX = canvas.width / 2;
var posY = canvas.height - 100;
var dx = 0;
var dy = 0;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var maxJumpHeight = posY - 120;
var doublejump = false;
var posShuriken;
var throwing = false;
var curFrame = 0;
var curFrameShuriken = 0;
var leftShuriken = false;
var velocityShuriken = 0;

var counter = 0;

var shuriken = new Image();
shuriken.src = "img/shuriken.png";
var animation = new Image();
var idle = new Image();
idle.src = "img/idle.png";
var runleft = new Image();
runleft.src = "img/runleft.png";
var runright = new Image();
runright.src = "img/runright.png";
var jumpMidL = new Image();
jumpMidL.src = "img/jumpMidL.png";
var jumpMidR = new Image();
jumpMidR.src = "img/jumpMid.png";

//konstruerer objekter med info om sprites som brukes til animasjon
class spriteAnimationConstructor {
  constructor(
    spriteWidth,
    spriteHeight,
    charWidth,
    charHeight,
    frameCount,
    source
  ) {
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.charWidth = charWidth;
    this.charHeight = charHeight;
    this.frameCount = frameCount;
    this.source = source;
  }
}
const shurikenSprite = new spriteAnimationConstructor(
  1493,
  427,
  30,
  30,
  4,
  shuriken.src
);
const idleSprite = new spriteAnimationConstructor(
  2420,
  449,
  40,
  75,
  10,
  idle.src
);
const runLeftSprite = new spriteAnimationConstructor(
  3723,
  468,
  60,
  75,
  10,
  runleft.src
);
const runRightSprite = new spriteAnimationConstructor(
  3723,
  468,
  60,
  75,
  10,
  runright.src
);
const midJumpLeftSprite = new spriteAnimationConstructor(
  362,
  483,
  55,
  75,
  1,
  jumpMidL.src
);
const midJumpRightSprite = new spriteAnimationConstructor(
  362,
  483,
  55,
  75,
  1,
  jumpMidR.src
);

//legger til lyttere til taste nedtrykk og opptrykk
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//tast ned kode
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  } else if (e.keyCode == 38) {
    jump();
  }
}

//tast opp kode
function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  } else if (e.keyCode == 68 && throwing == false) {
    velocityShuriken = 10;
    throwShuriken();
  } else if (e.keyCode == 65 && throwing == false) {
    velocityShuriken = -10;
    throwShuriken();
  }
}

//finner rett animasjon ift. bevegelse, og kjører changeAnimation.
function findAnimation() {
  if (
    (!rightPressed && !leftPressed && dy == 0) ||
    (leftPressed && rightPressed && dy == 0)
  ) {
    changeAnimation(idleSprite);
  } else if (leftPressed && posY == canvas.height - 100) {
    changeAnimation(runLeftSprite);
  } else if (rightPressed && posY == canvas.height - 100) {
    changeAnimation(runRightSprite);
  } else if (posY < canvas.height - 100 && leftPressed) {
    changeAnimation(midJumpLeftSprite);
  } else {
    changeAnimation(midJumpRightSprite);
  }
}

//endrer variablene som blir brukt for å endre animasjon, tilhørende animasjonstypen som blir kalt inn i funksjonen.
function changeAnimation(sprite) {
  animation.src = sprite.source;
  spriteWidth = sprite.spriteWidth;
  spriteHeight = sprite.spriteHeight;
  frameCount = sprite.frameCount;
  charWidth = sprite.charWidth;
  charHeight = sprite.charHeight;
}

//animasjon shit
function updateIndex() {
  counter += 0.4;
  if (counter == 1.6) {
    counter = 0;
  }
  //Updating the frame index of sprite shit
  curFrame = (curFrame + Math.floor(counter)) % frameCount;

  //Calculating the x coordinate for spritesheet
  srcX = (curFrame * spriteWidth) / frameCount;
}

function updateFrameShuriken() {
  curFrameShuriken = (curFrameShuriken + Math.floor(counter)) % 4;
  console.log(Math.floor(counter));
  //Calculating the x coordinate for spritesheet
  srcXShuriken =
    curFrameShuriken * (shurikenSprite.spriteWidth / shurikenSprite.frameCount);
}

//tregner shuriken man kaster
function drawShuriken() {
  ctx.drawImage(
    shuriken,
    srcXShuriken,
    0,
    shurikenSprite.spriteWidth / shurikenSprite.frameCount,
    shurikenSprite.spriteHeight,
    posShuriken,
    posYShuriken,
    shurikenSprite.charWidth,
    shurikenSprite.charWidth
  );
}

//tegner karakteren ift. bilde, sourcex og y, høyde bredde på bildetklippet, posisjon på kanvas, og karakter h/b
function drawChar() {
  ctx.drawImage(
    animation,
    srcX,
    0,
    spriteWidth / frameCount,
    spriteHeight,
    posX,
    posY,
    charWidth,
    charHeight
  );
}

//setter startposisjon til shuriken, samt gjør den true slik at den kjøres i draw()
function throwShuriken() {
  posShuriken = posX;
  posYShuriken = posY + 20;
  throwing = true;
  setTimeout(function() {
    throwing = false;
  }, 2000);
}

//kjøres konstant, det som får karakteren til å bevege seg
function move() {
  //beveger til venstre
  if (leftPressed) {
    dx = -7;
  }

  //beveger til høyre
  if (rightPressed) {
    dx = 7;
  }

  //endrer akselerasjonen nedover ved makshøyde
  if (posY <= maxJumpHeight) {
    dy = -dy;
  }

  //ved "landing" av hoppet, hvis bakkenivå og nedoveraks. stopper bevegelse osv.
  if (dy < 0 && posY >= canvas.height - 100) {
    dy = 0;
    posY = canvas.height - 100;
    doublejump = false;
    maxJumpHeight = posY - 120;
  }

  //stopper akselerasjon hvis ingen er trykt, begge er trykt, eller hvis veggene av kanvas begrenser.
  if (
    (leftPressed && rightPressed) ||
    (!leftPressed && !rightPressed) ||
    (leftPressed && posX < 0) ||
    (rightPressed && posX > canvas.width - charWidth)
  ) {
    dx = 0;
  }

  //beveger karakteren med akselerasjon angitt ovenfor
  posX += dx;
  posY -= dy;
}

//kjøres bare ved pil opp trykk, endrer variabler.
function jump() {
  //hopp fra bakken
  if (posY == canvas.height - 100) {
    dy = 5;
  }

  //dobbel hopp, hvis karakteren er på bakken, og han ikke har dobbelhoppet i hoppet.
  if (posY != canvas.height - 100 && doublejump == false) {
    dy = 10;
    doublejump = true;
    maxJumpHeight = posY - 120;
  }
}

//"tegne" funksjonen
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  move();
  updateFrameShuriken();
  findAnimation();
  updateIndex();
  drawChar();
  if (throwing == true) {
    posShuriken += velocityShuriken;
    drawShuriken();
  }
  requestAnimationFrame(draw);
}

draw();
