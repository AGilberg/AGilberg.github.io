var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var posX = canvas.width / 4;
var posY = canvas.height - 100;
var dx = 0;
var dy = 0;
var maxJumpHeight = posY - 120;
var doublejump = false;
var posShuriken;
var throwing = false;
var curFrame = 0;
var curFrameShuriken = 0;
var leftShuriken = false;
var velocityShuriken = 0;
var audioCounter = 0;
var friction = 0.9;

var counter = 0;

var audio = new Audio();
audio.src = "sakura.mp3";
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
var playSound = new Image();
playSound.src = "img/muteSound.png";

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


// Add click event listener to canvas element
canvas.addEventListener("click", function(event) {
  // Button position and dimensions
  var buttonX = 660;
  var buttonY = 45;
  // Control that click event occurred within position of button
  var rect = canvas.getBoundingClientRect();
  if (event.x - rect.left > buttonX && event.y - rect.top < buttonY) {
    // Executes if button was clicked!
    if (audioCounter % 2 == 0) {
      audio.play();
      playSound.src = "img/playSound.png";
    } else {
      audio.pause();
      playSound.src = "img/muteSound.png";
      audio.currentTime = 0;
    }
  }
  audioCounter++;
});


//finner rett animasjon ift. bevegelse, og kjører changeAnimation.
function findAnimation() {
  if (
    (!move.right && !move.left && dy == 0) ||
    (move.left && move.right && dy == 0)
  ) {
    changeAnimation(idleSprite);
  } else if (move.left && posY == canvas.height - 100) {
    changeAnimation(runLeftSprite);
  } else if (move.right && posY == canvas.height - 100) {
    changeAnimation(runRightSprite);
  } else if (posY < canvas.height - 100 && move.left) {
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

function drawSound() {
  ctx.drawImage(playSound, 0, 0, 512, 512, 665, 0, 50, 50);
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


move = {
  left:false,
  right:false,
  up:false,
  a:false,
  d:false,

  keyListener:function(event) {
    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {

      case 37:// venstre tast
        move.left = key_state;
      break;
      case 38:// opp tast
        move.up = key_state;
      break;
      case 39:// høyre tast
        move.right = key_state;
      break;
      case 68:// d tast
        move.d = key_state;
      break;
      case 65:// a tast
        move.a = key_state;
      break;

    }
  }
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

//"tegne"-funksjonen, kjører
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  if (move.up && dy == 0) {
    dy += 18;
  }
  if (move.left) {
    dx -= 0.8;
    changeAnimation(runLeftSprite);
  }
  if (move.right) {
    dx += 0.8;
    changeAnimation(runRightSprite);
  }

  if (move.d && throwing == false) {
    velocityShuriken = 10;
    throwShuriken();
  }
  if (move.a && throwing == false) {
    velocityShuriken = -10;
    throwShuriken();
  }

  // Fysikk for mindre rigide bevegleser
  dy -= 0.6;    // gravitasjon
  posX += dx; // akselerasjon x
  posY -= dy; // akselerasjon y
  dx *= 0.9;  // friksjon x
  dy *= 0.9; // friksjon y

  if (posY >= canvas.height - 100) {
    dy = 0;
    posY = canvas.height - 100;
  }

  if (posX >= canvas.width - 50) { // Hacky løsning:
    posX = canvas.width - 50;     // Endre fra 50 til sprite-bredde
  } else if (posX <= 0) {
    posX = 0;
  }

  updateFrameShuriken();
  findAnimation();
  updateIndex();
  drawChar();
  drawSound();
  if (throwing == true) {
    posShuriken += velocityShuriken;
    drawShuriken();
  }
  requestAnimationFrame(draw);
}
//legger til lyttere til taste nedtrykk og opptrykk
document.addEventListener("keydown", move.keyListener);
document.addEventListener("keyup", move.keyListener);

draw();
