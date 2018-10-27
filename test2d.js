var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var groundLevel = canvas.height - 100;
var posX = canvas.width / 2;
var posY = groundLevel;
var dx = 0;
var dy = 0;
var upReleased = false;
var posShuriken;
var throwing = false;
var curFrame = 0;
var curFrameShuriken = 0;
var leftShuriken = false;
var velocityShuriken = 0;
var audioCounter = 0;
var counter = 0;
var menuCounter = 0;
var game = false;
var friction = 0.9;
var doubleJump = false;
var lastRight = true;

var audio = new Audio();
audio.src = "sakura.mp3";
var shuriken = new Image();
shuriken.src = "img/shuriken.png";
var animation = new Image();
var idle = new Image();
idle.src = "img/idle.png";
var idleL = new Image();
idleL.src = "img/idleL.png";
var runleft = new Image();
runleft.src = "img/runleft.png";
var runright = new Image();
runright.src = "img/runright.png";
var jumpMidL = new Image();
jumpMidL.src = "img/jumpMidL.png";
var jumpMidR = new Image();
jumpMidR.src = "img/jumpMid.png";
var playSound = new Image();
playSound.src = "img/playSound.png";
var muteSound = new Image();
muteSound.src = "img/muteSound.png";
var imageSound = new Image();
imageSound.src = muteSound.src;
var menuBackground = new Image();
menuBackground.src = "img/Ninja.jpg";

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

class menuBoxConstructor {
  constructor(leftX, rightX, topY, bottomY) {
    (this.leftX = leftX),
      (this.rightX = rightX),
      (this.topY = topY),
      (this.bottomY = bottomY);
  }
}

const credits = new menuBoxConstructor(240, 367, 167, 194);
const instructions = new menuBoxConstructor(210, 410, 117, 147);
const startGame = new menuBoxConstructor(223, 395, 64, 98);
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
const idleLSprite = new spriteAnimationConstructor(
  2420,
  449,
  40,
  75,
  10,
  idleL.src
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
const startMenuSprite = new spriteAnimationConstructor(
  3723,
  468,
  40,
  40,
  10,
  runright.src
);

// Add click event listener to canvas element

canvas.addEventListener("click", function(event) {
  // Button position and dimensions
  var muteX = 660;
  var muteY = 45;
  // Control that click event occurred within position of button
  var rect = canvas.getBoundingClientRect();
  if (
    event.x - rect.left > muteX &&
    event.y - rect.top < muteY &&
    game == true
  ) {
    // Executes if button was clicked!
    if (audioCounter % 2 == 0) {
      audio.play();
      imageSound.src = playSound.src;
    } else {
      audio.pause();
      imageSound.src = muteSound.src;
      audio.currentTime = 0;
    }
    audioCounter++;
  }
  if (
    event.x - rect.left > startGame.leftX &&
    event.x - rect.left < startGame.rightX &&
    event.y - rect.top > startGame.topY &&
    event.y - rect.top < startGame.bottomY
  ) {
    posX = canvas.width / 2;
    posY = groundLevel;
    game = true;
  }
});

canvas.addEventListener("mousemove", function(event) {
  // Button position and dimensions

  // Control that mouseover event occurred within position of button
  var rect = canvas.getBoundingClientRect();
  if (
    event.x - rect.left > startGame.leftX &&
    event.x - rect.left < startGame.rightX &&
    event.y - rect.top > startGame.topY &&
    event.y - rect.top < startGame.bottomY &&
    game == false
  ) {
    menuCounter = 0;
  }
  if (
    event.x - rect.left > instructions.leftX &&
    event.x - rect.left < instructions.rightX &&
    event.y - rect.top > instructions.topY &&
    event.y - rect.top < instructions.bottomY &&
    game == false
  ) {
    menuCounter = 1;
  }
  if (
    event.x - rect.left > credits.leftX &&
    event.x - rect.left < credits.rightX &&
    event.y - rect.top > credits.topY &&
    event.y - rect.top < credits.bottomY &&
    game == false
  ) {
    menuCounter = 2;
  }
});

//finner rett animasjon ift. bevegelse, og kjører changeAnimation.
function findAnimation() {
  if (
    (!move.left && !move.right && dy == 0 && lastRight == true) ||
    (move.left && move.right && dy == 0 && lastRight == true)
  ) {
    changeAnimation(idleSprite);
  } else if (
    (!move.left && !move.right && dy == 0 && lastRight == false) ||
    (move.left && move.right && dy == 0 && lastRight == false)
  ) {
    changeAnimation(idleLSprite);
  } else if (move.left && posY >= canvas.height - 110) {
    changeAnimation(runLeftSprite);
  } else if (move.right && posY >= canvas.height - 110) {
    changeAnimation(runRightSprite);
  } else if (posY < groundLevel && lastRight == false) {
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
  posShuriken += velocityShuriken;
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
  ctx.drawImage(imageSound, 0, 0, 512, 512, 665, 0, 50, 50);
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
  left: false,
  right: false,
  up: false,
  a: false,
  d: false,

  keyListener: function(event) {
    var key_state = event.type == "keydown" ? true : false;

    switch (event.keyCode) {
      case 37: // venstre tast
        move.left = key_state;
        lastRight = false;
        break;
      case 38: // opp tast
        //dobbelhopp, endre linje3 senere for bedre verdi
        let skyLevel = posY;
        if (upReleased == true) {
          if (doubleJump == false) {
            dy += 18-(skyLevel/100); // 15
            doubleJump = true;
          }
        }
        move.up = key_state;
        jumped = true;
        break;
      case 39: // høyre tast
        move.right = key_state;
        lastRight = true;
        break;
      case 68: // d tast
        move.d = key_state;
        break;
      case 65: // a tast
        move.a = key_state;
        break;
      case 13:
        if (game == false) {
          if (menuCounter == 0) {
            posX = canvas.width / 2;
            posY = groundLevel;
            game = true;
          }
          if (menuCounter == 1) {
            //instruksjons kode
          }
          if (menuCounter == 2) {
            //credits kode
          }
        }
    }
  }
};
moveMenu = {
  up: false,
  down: false,

  keyListener: function(event) {
    var key_state = event.type == "keydown" ? true : false;
    switch (event.keyCode) {
      case 38:
        if (game == false) {
          menuCounter--;
          if (menuCounter == -1) {
            menuCounter = 2;
          }
        }
        if (game == true) {
          upReleased = true;
        }
        break;
      case 40:
        menuCounter++;
        if (menuCounter == 3) {
          menuCounter = 0;
        }
        break;
    }
  }
};

function moveChar() {
  if (move.up) {
    if (dy == 0) {
      dy += 18;
      doubleJump = false;
    }
  }

  if (move.left) {
    dx -= 0.8;
  }
  if (move.right) {
    dx += 0.8;
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
  dy -= 0.6; // gravitasjon
  posX += dx; // akselerasjon x
  posY -= dy; // akselerasjon y
  dx *= 0.9; // friksjon x
  dy *= 0.9; // friksjon y

  if (posY >= groundLevel) {
    dy = 0;
    posY = groundLevel;
    upReleased = false;
    doubleJump = true;
  }

  if (posX >= canvas.width - 50) {
    // Hacky løsning:
    posX = canvas.width - 50; // Endre fra 50 til sprite-bredde
  } else if (posX <= 0) {
    posX = 0;
  }
}
//"tegne" funksjonen
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (game == true) {
    updateFrameShuriken();
    findAnimation();
    updateIndex();
    moveChar();
    drawChar();
    drawSound();
    if (throwing == true) {
      drawShuriken();
    }
  } else if (game == false) {
    menu();
  }
  requestAnimationFrame(draw);
}

function menu() {
  ctx.drawImage(menuBackground, 0, 0, 1453, 1024, 0, 0, 720, 480);
  ctx.font = "25px Arial";
  ctx.fillText("START GAME", 230, 90);
  ctx.fillText("INSTRUCTIONS", 218, 140);
  ctx.fillText("CREDITS", 252, 190);
  moveChar();
  changeAnimation(startMenuSprite);
  updateIndex();
  drawChar();

  if (menuCounter == 0) {
    posX = 390;
    posY = 55;
  } else if (menuCounter == 1) {
    posX = 406;
    posY = 104;
  } else if (menuCounter == 2) {
    posX = 364;
    posY = 153;
  }
}

document.addEventListener("keydown", move.keyListener);
document.addEventListener("keyup", move.keyListener);
document.addEventListener("keyup", moveMenu.keyListener);

draw();
