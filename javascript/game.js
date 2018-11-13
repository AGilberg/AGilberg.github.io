// Mobil sjekk:
var mobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(
  navigator.userAgent.toLowerCase()
);
if (mobile) {
  document.body.innerHTML =
    //'<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=no"/>' +
    "<br>" +
    '<canvas id="canvas" width="720" height="480"></canvas>' +
    "<br>" +
    '<center><button type="button" id="showCanvas" class="button" onclick="goFullScreen()">Fullscreen</button></center>' +
    '<link rel="stylesheet" href="css/styles.css">';
  document.styleSheets[0].disabled = true;
}
//kode for fullskjerm på mobil
function goFullScreen() {
  if (window.innerHeight < window.innerWidth) {
    if (canvas.requestFullScreen) canvas.requestFullScreen();
    else if (canvas.webkitRequestFullScreen) canvas.webkitRequestFullScreen();
    else if (canvas.mozRequestFullScreen) canvas.mozRequestFullScreen();
    screen.orientation.lock("landscape-primary");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.visibility = "visible";
  } else {
    alert("Please enter landscape mode");
  }
}

// Canvas:
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.font = "25px freedom";
if (mobile) canvas.style.visibility = "hidden";

// Karakter:
var posX = canvas.width / 2; // Posisjon langs x-aksen. Starter på midten.
var posY; // Posisjon langs y-aksen.
var dx = 0; // Fartsvektor langs x-aksen.
var dy = 0; // Fartsvektor langs y-aksen.
var groundLevel = canvas.height - 190; // Bakkenivå
var friction = 0.9; //friksjon for mainChar
var gravity = 0.6; //gravity som blir brukt når mainChar hopper

// Kontroll:
var upReleased = false; //variabel som blir brukt for dobbelhopp
var lastRight = true; //variabel som blir brukt for å bestemme om person spriten skal se mot venstre eller høyre
var throwing = false; //variabel som blir brukt for å avgjøren om man kan kaste en ny shuriken
var doubleJump = false; //alltid false når man er på bakkenivå, true hvis man har tatt et dobbelhopp i luften.
var audioCounter = 0; //brukes for å avgjøre om lyden skal skrues av eller på.
var death = false; //avgjører om karakteren er død eller ikke
var score = 0; //teller hvor mange samurai man har drept
var timePassed = 0; //holder info om hvor lenge et spill har foregått

//"currentFrame", de fleste animasjonene har en spritesheet på 10 deler, og disse variablene vil variere mellom 0 og maks antall deler i sitt spritesheet
var curFrame = 0;
var curFrameEnemy = 0;
var curFrameShuriken = 0;

// Enemies:
var posXenemies = []; //en array med x posisjoner til enemies som går mot høyre
var posXenemiesLeft = []; //en array med x posisjoner til enemies som går mot venstre
var posYenemies = groundLevel; //en array med y posisjoner til enemies
var dxEnemies = []; //array med hastigheten til enemies
var srcXenemies = 0; //variabel som definerer hvor på spritesheeten man starter å "klippe"
var spriteEnemy = []; //array med hvilken animasjon enemies skal ha
var positionModifier; //blir brukt for hitbox registrering for enemies, siden sprites er ujevn.
var enemiesSpeed = 3; //hastigheten til enemies
var spawntimer = 1200; //del av matematisk algoritme som avgjør når enemies spawner

// Arrow: x og y posisjon til arrow
var arrowX;
var arrowY;

// Shuriken:
var posShuriken; //x posisjonen til shuriken man kaster
var srcXShuriken = 0; //definerer hvor på spritesheeten man skal starte å "klippe"
var velocityShuriken = 0; //definerer hastigheten til shuriken

// Meny: variabler som endres avhengig av om man er på menyen, spillet, history osv.
var menu = true;
var history = false;
var instructions = false;
var game = false;
var menuCounter = 0; //variabel for å bruke piltastene på menyen
var gameOver = false;

var counter = 0; //variabel som blir brukt for telling i animasjonsfunksjon
var srcX = 0; //variabel som definerer hvor på spritesheeten man starter å "klippe"

// Audio og sprites/grafikk:
var enemyBoop = new Audio();
enemyBoop.src = "sound/boop.wav";
var audio = new Audio();
audio.src = "sound/sakura.mp3";
var shuriken = new Image();
shuriken.src = "img/shuriken.png";
var animation = new Image();
var idleR = new Image();
idleR.src = "img/idle.png";
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
var gameBackground = new Image();
gameBackground.src = "img/background1.png";
var imageBack = new Image();
imageBack.src = "img/back.jpg";
var deathAnimation = new Image();
deathAnimation.src = "img/dead.png";
var enemyRight = new Image();
enemyRight.src = "img/enemyRight.png";
var enemyLeft = new Image();
enemyLeft.src = "img/enemyLeft.png";
var direction = new Image();
var arrow = new Image();
arrow.src = "img/arrow.png";
var howToPlay = new Image();
howToPlay.src = "img/howToPlay.png";

//Class hvor man sender inn informasjon om sprites som skal bli tegnet, og funksjoner for å tegne dem.
class SpriteAnimationConstructor {
  constructor(
    spriteWidth, //bredde på spritesheet delen som skal brukes
    spriteHeight, //høyde på spritesheet delen som skal brukes
    charWidth, //bredde på spriten som skal tegnes på canvas
    charHeight, //høyde på spriten som skal tegnes på canvas
    frameCount, //hvor mange deler en spritesheet har, vil endre på maksverdien til curFrame
    source //hvilket spritesheet som skal brukes
  ) {
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.charWidth = charWidth;
    this.charHeight = charHeight;
    this.frameCount = frameCount;
    this.source = source;
  }

  //Tegner hovedpersonen ift. variablene posX og posY, og informasjon om spriten som blir brukt.
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
  //"oppdaterer" hvilken sprite fra spritesheet som skal bli brukt i hovedkarakter animasjonen
  updateIndex() {
    if (counter == 3 && !death) {
      curFrame = (curFrame + 1) % this.frameCount;
      counter = 0;
    } else if (counter == 10 && death) {
      curFrame = (curFrame + 1) % this.frameCount;
      counter = 0;
    } else {
      if (!death || curFrame <= 8) {
        counter++;
      }
    }

    // Returnerer sourceX som blir i hovedkarakter animasjonen
    return (curFrame * this.spriteWidth) / this.frameCount;
  }

  //Tegner shuriken hvis throwing == true, og endrer posisjonen.
  drawShuriken() {
    if (throwing) {
      posShuriken += velocityShuriken;
      if (posShuriken < 0) {
        throwing = false;
      } else if (posShuriken > canvas.width) {
        throwing = false;
      }

      srcXShuriken = this.updateFrameShuriken();
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

  //"oppdaterer" hvilken sprite fra spritesheet som skal bli brukt i shuriken animasjonen
  updateFrameShuriken() {
    if (counter == 1) {
      curFrameShuriken = (curFrameShuriken + 1) % 4;
    }
    return (
      curFrameShuriken *
      (shurikenSprite.spriteWidth / shurikenSprite.frameCount)
    );
  }

  //"oppdaterer" hvilken sprite fra spritesheet som skal bli brukt i enemy animasjonen
  updateEnemySprite() {
    if (counter == 1) {
      curFrameEnemy = (curFrameEnemy + 1) % 10;
    }
    return (curFrameEnemy * enemySprite.spriteWidth) / enemySprite.frameCount;
  }

  //avgjør om enemies skal spawne via en matematisk algoritme, og kaller drawEnemy()
  chooseEnemy() {
    //random enemy spawn algoritme, flere spawns vanskelighetsgrad
    var testmath = Math.floor(Math.random() * spawntimer);

    //går igjennom hele samurai containeren. Hvis mattealgoritmen over er lik 0 f.eks, vil den første enemien spawne.
    //når en enemy spawner og blir true, er det tilfeldig om den spawner til venstre eller høyre.
    for (var arrays in enemiesContainer.samuraiLeft) {
      if (
        testmath == parseInt(arrays) &&
        !enemiesContainer.samuraiLeft[arrays]
      ) {
        enemiesContainer.samuraiLeft[arrays] = true;
        enemiesSpeed += 0.1;
        if (spawntimer > 500) {
          spawntimer *= 0.95;
        }
        if (counter % 2 == 0) {
          posXenemies[arrays] = canvas.width;
          dxEnemies[arrays] = -enemiesSpeed;
          spriteEnemy[arrays] = enemyLeft;
        } else if (counter % 2 == 1) {
          posXenemies[arrays] = -140;
          dxEnemies[arrays] = enemiesSpeed;
          spriteEnemy[arrays] = enemyRight;
        }
      }
    }
    this.drawEnemy();
  }

  //looper gjennom alle enemies som er true
  drawEnemy() {
    srcXenemies = this.updateEnemySprite();
    for (var arrays in enemiesContainer.samuraiLeft) {
      if (enemiesContainer.samuraiLeft[arrays]) {
        posXenemies[arrays] += dxEnemies[arrays];
        //despawner enemies hvis de går ut av canvas
        if (dxEnemies[arrays] < 0) {
          if (posXenemies[arrays] < -140) {
            enemiesContainer.samuraiLeft[arrays] = false;
          }
          positionModifier = 40;
        } else if (dxEnemies[arrays] > 0) {
          if (posXenemies[arrays] > canvas.width) {
            enemiesContainer.samuraiLeft[arrays] = false;
          }
          positionModifier = 100;
        }
        //Hvis enemies treffer hitboxen til hovedpersonen, kjøres charDeath funksjonen, og man taper.
        if (
          posXenemies[arrays] > posX - positionModifier &&
          posXenemies[arrays] < posX - positionModifier + 30 &&
          posY > groundLevel - 50
        ) {
          dxEnemies[arrays] = 0;
          charDeath();
        }
        //Hvis shuriken treffer hitboxen til enemies, despawner dem osv.
        if (
          posXenemies[arrays] > posShuriken - positionModifier &&
          posXenemies[arrays] < posShuriken - positionModifier + 30 &&
          throwing &&
          posYShuriken > groundLevel - 20
        ) {
          enemiesContainer.samuraiLeft[arrays] = false;
          throwing = false;
          score++;
          enemyBoop.currentTime = 0;
          enemyBoop.play();
        }

        ctx.drawImage(
          spriteEnemy[arrays],
          srcXenemies,
          0,
          this.spriteWidth / this.frameCount,
          this.spriteHeight,
          posXenemies[arrays],
          groundLevel,
          this.charWidth,
          this.charHeight
        );
      }
    }
  }
}

//objekter med informasjon om spritesene som brukes.
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
const idleRSprite = new SpriteAnimationConstructor(
  2420,
  449,
  40,
  75,
  10,
  idleR
);
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

//cointainer med true or false verdi for fiendene.
const enemiesContainer = {
  samuraiLeft: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]
};

//klasse som lager objekter med informasjon om hvor knappene på menyen, samt tilbakeknappen er.
class menuBoxConstructor {
  constructor(leftX, rightX, topY, bottomY) {
    (this.leftX = leftX),
      (this.rightX = rightX),
      (this.topY = topY),
      (this.bottomY = bottomY);
  }
}

const historyBox = new menuBoxConstructor(230, 377, 167, 194);
const instructionsBox = new menuBoxConstructor(210, 410, 117, 147);
const startGame = new menuBoxConstructor(223, 395, 64, 98);
const backButton = new menuBoxConstructor(0, 50, 0, 50);

canvas.addEventListener("click", function(event) {
  var muteX = canvas.width - 60;
  var muteY = 45;
  var rect = canvas.getBoundingClientRect();

  //skrur lyden av og på hvis man trykker på lyd knappen
  if (event.x - rect.left > muteX && event.y - rect.top < muteY && game) {
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

  //kode for spilling på mobil
  if (mobile) {
    if (game && !death) {
      if (event.y - rect.top < 240) {
        if (dy == 0) {
          dy += 30;
          doubleJump = false;
          curFrame = 0;
        }
      } else if (event.y - rect.top > 240 && !throwing) {
        if (event.x - rect.left > 360) {
          lastRight = true;
          velocityShuriken = 10;
          throwShuriken();
        } else if (event.x - rect.left < 360 && !throwing) {
          lastRight = false;
          velocityShuriken = -10;
          throwShuriken();
        }
      }
    }
    if (gameOver) {
      returnToMenu();
    }
  }

  //funskjon som avgjør om man har klikket innenfor et visst område
  function clicked(button, state) {
    return (
      event.x - rect.left > button.leftX &&
      event.x - rect.left < button.rightX &&
      event.y - rect.top > button.topY &&
      event.y - rect.top < button.bottomY &&
      menu == state
    );
  }

  if (clicked(startGame, true)) {
    posX = canvas.width / 2;
    posY = groundLevel;
    game = true;
    menu = false;
  }
  if (clicked(instructionsBox, true)) {
    menu = false;
    instructions = true;
  }
  if (clicked(historyBox, true)) {
    menu = false;
    history = true;
  }
  if (clicked(backButton, false) && !gameOver) {
    returnToMenu();
  }
});

// canvas.addEventListener("ontouchend", function(event) {
//   move.left = false;
//   move.right = false;
// });

canvas.addEventListener("mousemove", function(event) {
  var rect = canvas.getBoundingClientRect();

  //funksjon som avgjør om musen er over et visst område
  function mouseOver(button, state) {
    return (
      event.x - rect.left > button.leftX &&
      event.x - rect.left < button.rightX &&
      event.y - rect.top > button.topY &&
      event.y - rect.top < button.bottomY &&
      game == state
    );
  }
  if (mouseOver(startGame, false)) {
    menuCounter = 0;
  }
  if (mouseOver(instructionsBox, false)) {
    menuCounter = 1;
  }
  if (mouseOver(historyBox, false)) {
    menuCounter = 2;
  }
});

//finner rett animasjon ift. bevegelse, og kjører dem via animasjonsklassen øverst.
function findAnimation() {
  if (death) {
    deathAnimationSprite.animateMainChar();
  } else if (
    (!move.left && !move.right && dy == 0 && lastRight) ||
    (move.left && move.right && dy == 0 && lastRight)
  ) {
    idleRSprite.animateMainChar();
  } else if (
    (!move.left && !move.right && dy == 0 && !lastRight) ||
    (move.left && move.right && dy == 0 && !lastRight)
  ) {
    idleLSprite.animateMainChar();
  } else if (move.left && posY >= groundLevel) {
    runLeftSprite.animateMainChar();
  } else if (move.right && posY >= groundLevel) {
    runRightSprite.animateMainChar();
  } else if (posY < groundLevel && !lastRight) {
    midJumpLeftSprite.animateMainChar();
  } else {
    midJumpRightSprite.animateMainChar();
  }
}

function drawSound() {
  ctx.drawImage(imageSound, 0, 0, 512, 512, canvas.width - 55, 0, 50, 50);
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

//Gjør at hovedpersonen dør
function charDeath() {
  if (!death) {
    curFrame = 0;
    counter = 0;
    death = true;
    enemiesSpeed = 2;
    spawntimer = 1200;
    setTimeout(() => {
      if (death) {
        gameOver = true;
      }
    }, 3000);
  }
}

//endrer på noen variabler slik at man kan starte et nytt game fra menyen
function returnToMenu() {
  history = false;
  instructions = false;
  game = false;
  for (var enemies in enemiesContainer.samuraiLeft) {
    enemiesContainer.samuraiLeft[enemies] = false;
  }
  score = 0;
  death = false;
  gameOver = false;
  counter = 0;
  menu = true;
  arrowY = -400;
}

//teller hvor mange sekunder man har vært i spillet
setInterval(() => {
  if (game) {
    if (!death) {
      timePassed++;
    }
  } else {
    timePassed = 0;
  }
}, 1000);

//spawner arrows hvert andre sekund
setInterval(() => {
  if (game && score > 20) {
    arrowX = Math.floor(Math.random() * 700);
    arrowY = -50;
  }
}, 2000);

//tegner arrows + hitbox
function drawArrow() {
  if (!mobile) {
    arrowY += 4;
    ctx.drawImage(arrow, arrowX, arrowY, 20, 50);
    if (
      arrowY > posY - 40 &&
      arrowY < posY + 70 &&
      arrowX > posX + 20 &&
      arrowX < posX + 40
    ) {
      charDeath();
    }
  }
}

//objekt med keylistener event for forskjellige knappetrykk
move = {
  left: false,
  right: false,
  up: false,
  space: false,

  keyListener: function(event) {
    var key_state = event.type == "keydown" ? true : false;

    switch (event.keyCode) {
      case 37: // venstre tast
        move.left = key_state;
        break;
      case 38: // opp tast
        //dobbelhopp, endre linje3 senere for bedre verdi
        let skyLevel = posY;
        if (upReleased) {
          if (!doubleJump) {
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
      case 32: // spacebar tast
        move.space = key_state;
        if (gameOver) {
          returnToMenu();
        }
        break;
      case 13: //enter tast
        if (!game) {
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
            history = true;
            menu = false;
          }
        }
    }
  }
};

//objekt med keylistener event for tastetrykk, for menyen
moveMenu = {
  up: false,
  down: false,

  keyListener: function(event) {
    var key_state = event.type == "keyup" ? true : false;
    switch (event.keyCode) {
      case 38:
        if (!game) {
          menuCounter--;
          if (menuCounter == -1) {
            menuCounter = 2;
          }
        }
        if (game) {
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

//funksjon som tar seg av bevegelse, i forhold til tastetrykkene.
function moveChar() {
  if (!death) {
    //hopping
    if (move.up) {
      if (dy == 0) {
        dy += 18;
        doubleJump = false;
        curFrame = 0;
      }
    }
    //bevegelse venstre
    if (move.left) {
      dx -= 0.8;
      lastRight = false;
    }
    //bevegelse høyre
    if (move.right) {
      dx += 0.8;
      lastRight = true;
    }
    //kaster shuriken
    if (move.space && !throwing) {
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

  //kjøres når man lander etter et hopp
  if (posY >= groundLevel && dy != 0) {
    dy = 0;
    posY = groundLevel;
    upReleased = false;
    doubleJump = true;
  }

  //begrenser bevegelsen innenfor canvas
  if (posX >= canvas.width - 50) {
    posX = canvas.width - 50; // Endre fra 50 til sprite-bredde
  } else if (posX <= 0) {
    posX = 0;
  }
}

//hoved gameloop funksjonen
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (game) {
    ctx.drawImage(gameBackground, 0, 0, canvas.width, canvas.height);
    findAnimation();
    drawSound();
    drawBackButton();
    shurikenSprite.drawShuriken();
    enemySprite.chooseEnemy();
    moveChar();
    drawArrow();
    if (!gameOver) {
      ctx.fillText(
        "You have defeated " +
          score +
          " samurai, in " +
          timePassed +
          " seconds",
        40,
        90
      );
    } else {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("GAME OVER", 275, 150);
      ctx.fillText(
        "samurai defeated: " + score + ", time: " + timePassed,
        148,
        200
      );
      ctx.fillText("Press spacebar to return to the menu", 67, 250);
    }
  } else if (menu) {
    menuDraw();
    startMenuSprite.animateMainChar();
    timePassed = 0;
  } else if (instructions) {
    instructionsDraw();
    drawBackButton();
  } else if (history) {
    historyDraw();
    drawBackButton();
  }

  requestAnimationFrame(draw);
}

//meny funksjonen
function menuDraw() {
  ctx.fillStyle = "#000000";
  ctx.font = "25px freedom";
  ctx.fillText("START GAME", 212, 90);
  ctx.fillText("INSTRUCTIONS", 214, 140);
  ctx.fillText("HISTORY", 252, 190);

  if (menuCounter == 0) {
    posX = 400;
    posY = 55;
  } else if (menuCounter == 1) {
    posX = 406;
    posY = 104;
  } else if (menuCounter == 2) {
    posX = 364;
    posY = 153;
  }
}

//instructions funksjonen
function instructionsDraw() {
  ctx.drawImage(howToPlay, 0, 0, 720, 480);
}

//history funksjonen
function historyDraw() {
  ctx.fillStyle = "#FFBD9E";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.stroke();
  ctx.fillStyle = "#000000";
  ctx.font = "15px arial";
  ctx.fillText(
    "På tidlig 1400-tallet i Japan var det en tung tid for folk som levde i den laveste klassen.",
    70,
    110
  );
  ctx.fillText(
    "Bønder og fattige ble tvunget til å jobbe lange dager og måtte betale mye i skatt,",
    70,
    140
  );
  ctx.fillText("dette førte til stor frustrasjon som bygde seg opp.", 70, 170);

  ctx.fillText("Vilkårene ble hardere og hardere og livet var tungt,", 70, 220);
  ctx.fillText(
    "for å komme seg ut av undertrykkelsen begynte de å trene kampsporten “ninjutsu” ",
    70,
    250
  );
  ctx.fillText("(kunsten å holde seg skjult). ", 70, 280);
  ctx.fillText(
    "Ut fra dette kom ninjane og de måtte kjempe mot samuraiene,",
    70,
    340
  );
  ctx.fillText(
    "spillet baserer seg på kampen mellom ninjane og samuraiene.",
    70,
    370
  );
  ctx.font = "25px freedom";
}

document.addEventListener("keydown", move.keyListener);
document.addEventListener("keyup", move.keyListener);
document.addEventListener("keyup", moveMenu.keyListener);
document.addEventListener(
  "keydown",
  function(e) {
    // space and arrow keys, prevent scrolling
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  },
  false
);
