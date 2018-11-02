// Canvas:
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Karakter:
var posX = canvas.width / 2; // Posisjon langs x-aksen. Starter på midten.
var posY; // Posisjon langs y-aksen.
var dx = 0; // Fartsvektor langs x-aksen.
var dy = 0; // Fartsvektor langs y-aksen.
var groundLevel = canvas.height - 190; // Bakkenivå
var friction = 0.9;
var gravity = 0.6;

// Kontroll:
var upReleased = false;
var lastRight = true;
var throwing = false;
var curFrameEnemy = 0;
var curFrameShuriken = 0;
var doubleJump = false;
var audioCounter = 0;
var death = false;
var score = 0;

// Enemies:
var posXenemies = [];
var posXenemiesLeft = [];
var posYenemies = [];
var dxEnemies = 2;

// Shuriken:
var posShuriken;
var curFrameShuriken = 0;
var posShuriken;
var leftShuriken = false;
var srcXShuriken = 0;
var velocityShuriken = 0;

// Meny:
var menu = true;
var credits = false;
var instructions = false;
var menuCounter = 0;
var game = false;

var menuCounter = 0;
var curFrame = 0;
var counter = 0;
var srcX = 0;

// Audio og sprites/grafikk:
var audio = new Audio();
audio.src = "sakura.mp3";
var shuriken = new Image();
shuriken.src = "img/shuriken.png";
var animation = new Image();
var idle = new Image();
idle.src = "img/idle.png";
var idleL = new Image();
idleL.src = "img/idleL.png";
var runLeft = new Image();
runLeft.src = "img/runLeft.png";
var runRight = new Image();
runRight.src = "img/runRight.png";
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
var enemyRight = new Image();
enemyRight.src = "img/enemyRight.png";
var enemyLeft = new Image();
enemyLeft.src = "img/enemyLeft.png";

//Class with objects containing information of sprites, and functions to draw them
class SpriteAnimationConstructor {
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

  //animate main character at posx and posy with information depending on sprite used.
  animateMainChar() {
    ctx.drawImage(
      this.source,
      this.updateIndex(),
      0,
      this.spriteWidth / this.frameCount,
      this.spriteHeight,
      posX,
      posY,
      this.charWidth,
      this.charHeight
    );
  }
  //returns which sprite from mainChar spritesheet to use
  updateIndex() {
    if (counter == 3 && death == false) {
      curFrame = (curFrame + 1) % this.frameCount;
      counter = 0;
    } else if (counter == 10 && death == true) {
      curFrame = (curFrame + 1) % this.frameCount;
      counter = 0;
    } else {
      if (death == false || curFrame <= 8) {
        counter++;
      }
    }

    //Calculating the x coordinate for spritesheet
    return (curFrame * this.spriteWidth) / this.frameCount;
  }

  //Draw shuriken if throwing == true
  drawShuriken() {
    if (throwing == true) {
      posShuriken += velocityShuriken;
      if (posShuriken < 0) {
        throwing = false;
      } else if (posShuriken > 720) {
        throwing = false;
      }
      ctx.drawImage(
        shuriken,
        this.updateFrameShuriken(),
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
  //returns which sprite from shuriken spritesheet to use
  updateFrameShuriken() {
    if (counter == 1) {
      curFrameShuriken = (curFrameShuriken + 1) % 4;
    }
    //Calculating the x coordinate for spritesheet
    return (srcXShuriken =
      curFrameShuriken *
      (shurikenSprite.spriteWidth / shurikenSprite.frameCount));
  }

  chooseEnemy() {
    var testmath = Math.floor(Math.random() * 2000); //random enemy spawn algoritme enemytest, flere spawns vanskelighetsgrad
    if (counter == 1) {
      curFrameEnemy = (curFrameEnemy + 1) % 10;
    }
    var srcXenemies =
      (curFrameEnemy * enemySprite.spriteWidth) / enemySprite.frameCount;
    this.drawEnemy(testmath, srcXenemies);
  }
  //enemytest
  drawEnemy(testmath, srcXenemies) {
    for (var arrays in enemiesContainer.samuraiRight) {
      if (
        testmath == 46 + parseInt(arrays) &&
        enemiesContainer.samuraiRight[arrays] == false
      ) {
        enemiesContainer.samuraiRight[arrays] = true;
        posXenemies[arrays] = -140;
        posYenemies = groundLevel;
      }
      if (enemiesContainer.samuraiRight[arrays] == true) {
        posXenemies[arrays] += dxEnemies;
        if (
          posXenemies[arrays] > posX - 120 &&
          posXenemies[arrays] < posX - 80 &&
          posY > groundLevel - 50
        ) {
          charDeath();
        }
        if (posXenemies[arrays] > 720) {
          enemiesContainer.samuraiRight[arrays] = false;
        }
        if (
          posXenemies[arrays] + 85 < posShuriken &&
          posXenemies[arrays] + 105 > posShuriken &&
          throwing == true &&
          posYShuriken > groundLevel - 20
        ) {
          enemiesContainer.samuraiRight[arrays] = false;
          throwing = false;
          score++;
        }

        ctx.drawImage(
          enemyRight,
          srcXenemies,
          0,
          this.spriteWidth / this.frameCount,
          this.spriteHeight,
          posXenemies[arrays],
          posYenemies,
          this.charWidth,
          this.charHeight
        );
      }
    }
    for (var arrays in enemiesContainer.samuraiRight) {
      if (
        testmath == 54 + parseInt(arrays) &&
        enemiesContainer.samuraiLeft[arrays] == false
      ) {
        enemiesContainer.samuraiLeft[arrays] = true;
        posXenemiesLeft[arrays] = 720;
        posYenemies = groundLevel;
      }
      if (enemiesContainer.samuraiLeft[arrays] == true) {
        posXenemiesLeft[arrays] -= dxEnemies;
        if (
          posXenemiesLeft[arrays] > posX - 40 &&
          posXenemiesLeft[arrays] < posX &&
          posY > groundLevel - 50
        ) {
          charDeath();
        }
        if (posXenemiesLeft[arrays] < -140) {
          enemiesContainer.samuraiLeft[arrays] = false;
        }
        if (
          posXenemiesLeft[arrays] + 15 < posShuriken &&
          posXenemiesLeft[arrays] + 35 > posShuriken &&
          throwing == true &&
          posYShuriken > groundLevel - 20
        ) {
          enemiesContainer.samuraiLeft[arrays] = false;
          throwing = false;
          score++;
        }

        ctx.drawImage(
          enemyLeft,
          srcXenemies,
          0,
          this.spriteWidth / this.frameCount,
          this.spriteHeight,
          posXenemiesLeft[arrays],
          posYenemies,
          this.charWidth,
          this.charHeight
        );
      }
    }
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

const creditsBox = new menuBoxConstructor(240, 367, 167, 194);
const instructionsBox = new menuBoxConstructor(210, 410, 117, 147);
const startGame = new menuBoxConstructor(223, 395, 64, 98);
const backButton = new menuBoxConstructor(0, 50, 0, 50);
const enemySprite = new SpriteAnimationConstructor(
  5220,
  255,
  180,
  80,
  10,
  enemyRight
);
const deathAnimationSprite = new SpriteAnimationConstructor(
  4920,
  508,
  80,
  80,
  10,
  deathAnimation
);
const shurikenSprite = new SpriteAnimationConstructor(
  1493,
  427,
  30,
  30,
  4,
  shuriken
);
const idleSprite = new SpriteAnimationConstructor(2420, 449, 40, 75, 10, idle);
const idleLSprite = new SpriteAnimationConstructor(
  2420,
  449,
  40,
  75,
  10,
  idleL
);
const runLeftSprite = new SpriteAnimationConstructor(
  3723,
  468,
  60,
  75,
  10,
  runLeft
);
const runRightSprite = new SpriteAnimationConstructor(
  3723,
  468,
  60,
  75,
  10,
  runRight
);
const midJumpLeftSprite = new SpriteAnimationConstructor(
  362,
  483,
  55,
  75,
  1,
  jumpMidL
);
const midJumpRightSprite = new SpriteAnimationConstructor(
  362,
  483,
  55,
  75,
  1,
  jumpMidR
);
const startMenuSprite = new SpriteAnimationConstructor(
  3723,
  468,
  40,
  40,
  10,
  runRight
);

//enemytest antall fiender man kan ha samtidig.
const enemiesContainer = {
  samuraiLeft: [false, false, false, false, false, false],
  samuraiRight: [false, false, false, false, false, false]
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
    for (var enemies in enemiesContainer.samuraiLeft) {
      enemiesContainer.samuraiLeft[enemies] = false;
    }
    for (var enemies in enemiesContainer.samuraiRight) {
      enemiesContainer.samuraiRight[enemies] = false;
    }
    death = false;
    menu = true;
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
    deathAnimationSprite.animateMainChar();
  } else if (
    (!move.left && !move.right && dy == 0 && lastRight == true) ||
    (move.left && move.right && dy == 0 && lastRight == true)
  ) {
    idleSprite.animateMainChar();
  } else if (
    (!move.left && !move.right && dy == 0 && lastRight == false) ||
    (move.left && move.right && dy == 0 && lastRight == false)
  ) {
    idleLSprite.animateMainChar();
  } else if (move.left && posY >= groundLevel) {
    runLeftSprite.animateMainChar();
  } else if (move.right && posY >= groundLevel) {
    runRightSprite.animateMainChar();
  } else if (posY < groundLevel && lastRight == false) {
    midJumpLeftSprite.animateMainChar();
  } else {
    midJumpRightSprite.animateMainChar();
  }
}

function drawSound() {
  ctx.drawImage(imageSound, 0, 0, 512, 512, 665, 0, 50, 50);
}
function drawBackButton() {
  ctx.drawImage(imageBack, 0, 0, 512, 512, 9, 5, 40, 40);
}

//setter startposisjon til shuriken, samt gjør den true slik at den kjøres i draw()
function throwShuriken() {
  posShuriken = posX;
  posYShuriken = posY + 20;
  throwing = true;
}
function charDeath() {
  if (death == false) {
    curFrame = 0;
    counter = 0;
    dxEnemies = 0;
    death = true;
  }
}

move = {
  left: false,
  right: false,
  up: false,
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
          charDeath();
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
        curFrame = 0;
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
      if (lastRight) {
        velocityShuriken = 10;
      } else {
        velocityShuriken = -10;
      }
      throwShuriken();
    }
  }

  // Fysikk for mindre rigide bevegleser
  dy -= gravity; // gravitasjon
  posX += dx; // akselerasjon x
  posY -= dy; // akselerasjon y
  dx *= friction; // friksjon x
  dy *= friction; // friksjon y

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
    findAnimation();
    drawSound();
    drawBackButton();
    shurikenSprite.drawShuriken();
    enemySprite.chooseEnemy();
    moveChar();
    if (death == false) {
      ctx.fillText("You have defeated " + score + " samurai", 180, 90);
    } else {
      ctx.fillText("GAME OVER, you deafeated " + score + " samurai", 130, 90);
    }
  }
  if (menu == true) {
    menuDraw();
    startMenuSprite.animateMainChar();
  }
  if (instructions == true) {
    instructionsDraw();
    drawBackButton();
  }
  if (credits == true) {
    creditsDraw();
    drawBackButton();
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
draw();
