var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var posX = canvas.width / 2;
var posY;
var groundLevel = canvas.height - 100;
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
var menu = true;
var credits = false;
var instructions = false;
var friction = 0.9;
var doubleJump = false;
var lastRight = true;
var death = false;

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
var imageBack = new Image();
imageBack.src = "img/back.jpg";
var deathAnimation = new Image();
deathAnimation.src = "img/dead.png";

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

  animate() {}
}

class menuBoxConstructor {
  constructor(leftX, rightX, topY, bottomY) {
    (this.leftX = leftX),
      (this.rightX = rightX),
      (this.topY = topY),
      (this.bottomY = bottomY);
  }
}
//enemytest
const enemySprite = new spriteAnimationConstructor(
  3723,
  468,
  60,
  75,
  10,
  runright.src
);

const creditsBox = new menuBoxConstructor(240, 367, 167, 194);
const instructionsBox = new menuBoxConstructor(210, 410, 117, 147);
const startGame = new menuBoxConstructor(223, 395, 64, 98);
const backButton = new menuBoxConstructor(0, 50, 0, 50);
const deathAnimationSprite = new spriteAnimationConstructor(
  4920,
  508,
  80,
  80,
  10,
  deathAnimation.src
);
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
//enemytest antall fiender man kan ha samtidig.
const enemiesContainer = {
  samurai: {
    test1: false,
    test2: false,
    test3: false,
    test4: false
  },
  ninja: {
    test1: false,
    test2: false,
    test3: false,
    test4: false
  }
};

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
    event.y - rect.top < startGame.bottomY &&
    menu == true
  ) {
    posX = canvas.width / 2;
    posY = groundLevel;
    game = true;
    menu = false;
  }
  if (
    event.x - rect.left > instructionsBox.leftX &&
    event.x - rect.left < instructionsBox.rightX &&
    event.y - rect.top > instructionsBox.topY &&
    event.y - rect.top < instructionsBox.bottomY &&
    menu == true
  ) {
    menu = false;
    instructions = true;
  }
  if (
    event.x - rect.left > creditsBox.leftX &&
    event.x - rect.left < creditsBox.rightX &&
    event.y - rect.top > creditsBox.topY &&
    event.y - rect.top < creditsBox.bottomY &&
    menu == true
  ) {
    menu = false;
    credits = true;
  }
  if (
    event.x - rect.left > backButton.leftX &&
    event.x - rect.left < backButton.rightX &&
    event.y - rect.top > backButton.topY &&
    event.y - rect.top < backButton.bottomY &&
    menu == false
  ) {
    credits = false;
    instructions = false;
    game = false;
    menu = true;
    death = false;
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
    event.x - rect.left > instructionsBox.leftX &&
    event.x - rect.left < instructionsBox.rightX &&
    event.y - rect.top > instructionsBox.topY &&
    event.y - rect.top < instructionsBox.bottomY &&
    game == false
  ) {
    menuCounter = 1;
  }
  if (
    event.x - rect.left > creditsBox.leftX &&
    event.x - rect.left < creditsBox.rightX &&
    event.y - rect.top > creditsBox.topY &&
    event.y - rect.top < creditsBox.bottomY &&
    game == false
  ) {
    menuCounter = 2;
  }
});

//finner rett animasjon ift. bevegelse, og kjører changeAnimation.
function findAnimation() {
  if (death == true) {
    changeAnimation(deathAnimationSprite);
  } else if (
    (!move.left && !move.right && dy == 0 && lastRight == true) ||
    (move.left && move.right && dy == 0 && lastRight == true)
  ) {
    changeAnimation(idleSprite);
  } else if (
    (!move.left && !move.right && dy == 0 && lastRight == false) ||
    (move.left && move.right && dy == 0 && lastRight == false)
  ) {
    changeAnimation(idleLSprite);
  } else if (move.left && posY >= groundLevel) {
    changeAnimation(runLeftSprite);
  } else if (move.right && posY >= groundLevel) {
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
  if (death == false) {
    counter += 0.4;
    if (counter == 1.6) {
      counter = 0;
    }
  }
  if (death == true) {
    if (curFrame <= 8) {
      counter += 0.1;
    } else {
      counter = 0;
    }

    if (counter >= 1.1) {
      counter = 0;
    }
  }
  //Updating the frame index of sprite shit
  curFrame = (curFrame + Math.floor(counter)) % frameCount;

  //Calculating the x coordinate for spritesheet
  srcX = (curFrame * spriteWidth) / frameCount;
  //enemytest
  srcXenemies = (curFrame * enemySprite.spriteWidth) / enemySprite.frameCount;
}

function updateFrameShuriken() {
  curFrameShuriken = (curFrameShuriken + Math.floor(counter)) % 4;
  //Calculating the x coordinate for spritesheet
  srcXShuriken =
    curFrameShuriken * (shurikenSprite.spriteWidth / shurikenSprite.frameCount);
}

//tregner shuriken man kaster
function drawShuriken() {
  if (throwing == true) {
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
}

function drawSound() {
  ctx.drawImage(imageSound, 0, 0, 512, 512, 665, 0, 50, 50);
}
function drawBackButton() {
  ctx.drawImage(imageBack, 0, 0, 512, 512, 9, 5, 40, 40);
}
//enemytest
function drawEnemy() {
  ctx.drawImage(
    runright,
    srcXenemies,
    0,
    enemySprite.spriteWidth / enemySprite.frameCount,
    spriteHeight,
    0,
    groundLevel,
    50,
    50
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
  }, 1170);
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
        break;
      case 38: // opp tast
        //dobbelhopp, endre linje3 senere for bedre verdi
        let skyLevel = posY;
        if (upReleased == true) {
          if (doubleJump == false) {
            dy += 18 - skyLevel / 100; // 15
            doubleJump = true;
          }
        }
        move.up = key_state;
        jumped = true;
        break;
      case 39: // høyre tast
        move.right = key_state;
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
            menu = false;
          }
          if (menuCounter == 1) {
            instructions = true;
            menu = false;
          }
          if (menuCounter == 2) {
            credits = true;
            menu = false;
          }
        }
    }
  }
};
moveMenu = {
  up: false,
  down: false,

  keyListener: function(event) {
    var key_state = event.type == "keyup" ? true : false;
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
      case 81:
        if (death == false) {
          curFrame = 0;
          counter = 0;
          death = true;
        }
    }
  }
};

function moveChar() {
  if (death == false) {
    if (move.up) {
      if (dy == 0) {
        dy += 18;
        doubleJump = false;
      }
    }

    if (move.left) {
      dx -= 0.8;
      lastRight = false;
    }
    if (move.right) {
      dx += 0.8;
      lastRight = true;
    }

    if (move.d && throwing == false) {
      velocityShuriken = 10;
      throwShuriken();
    }
    if (move.a && throwing == false) {
      velocityShuriken = -10;
      throwShuriken();
    }
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
  testmath = Math.floor(Math.random() * 400); //random enemy spawn algoritme enemytest, flere spawns vanskelighetsgrad
  if (testmath == 46 && enemiesContainer.test1 == false) {
    enemiesContainer.test1 = true;
  }
  if (game == true) {
    updateFrameShuriken();
    findAnimation();
    drawSound();
    drawBackButton();
    drawShuriken();
    moveChar();
    drawEnemy();
  }
  if (menu == true) {
    menuDraw();
    changeAnimation(startMenuSprite);
  }
  if (instructions == true) {
    instructionsDraw();
    drawBackButton();
  }
  if (credits == true) {
    creditsDraw();
    drawBackButton();
  }
  if (game == true || menu == true) {
    updateIndex();
    drawChar();
  }
  requestAnimationFrame(draw);
}

function menuDraw() {
  ctx.drawImage(menuBackground, 0, 0, 1453, 1024, 0, 0, 720, 480);
  ctx.font = "25px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("START GAME", 230, 90);
  ctx.fillText("INSTRUCTIONS", 218, 140);
  ctx.fillText("CREDITS", 252, 190);

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

function instructionsDraw() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 720, 480);
  ctx.rect(0, 0, 720, 480);
  ctx.stroke();
}

function creditsDraw() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 720, 480);
  ctx.rect(0, 0, 720, 480);
  ctx.stroke();
}

document.addEventListener("keydown", move.keyListener);
document.addEventListener("keyup", move.keyListener);
document.addEventListener("keyup", moveMenu.keyListener);
console.log(enemySprite);
draw();
