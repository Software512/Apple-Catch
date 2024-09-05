let score = 0;
let highscore = 0;
let started = false;
let gameWidth;
let gameOffset;
let widescreen;
let apple1Pos = [0, 0];
let apple2Pos = [0, 0];
let apple3Pos = [0, 0];
let apple4Pos = [0, 0];
let apple1 = { rotten: false, used: false };
let apple2 = { rotten: false, used: false };
let apple3 = { rotten: false, used: false };
let apple4 = { rotten: false, used: false };
let basketPos = 45;
let scoreDisplay;
let spawnTime;
let mousePos;
let infoOpen = false;
let speed = {
    apple: 0.65,
    basket: 1.4,
    spawnBase: 50,
    spawnRandom: 15,
    tick: 10
}
let time = 0;
let tickTimer;
let isSlow = false;

window.addEventListener("resize", resize);

resize();

if (document.cookie !== "") {
    highscore = document.cookie.split("=")[1];
}

function resize() {
    if (window.innerWidth * 0.75 > window.innerHeight) {
        widescreen = true;
        document.getElementById("game").style.height = window.innerHeight * 0.9 + "px";
        document.getElementById("game").style.width = window.innerHeight * 4 / 3 * 0.9 + "px";
        gameWidth = window.innerHeight * 4 / 3 * 0.9;
        document.getElementById("game").style.left = (window.innerWidth - (window.innerHeight * 4 / 3 * 0.9)) / 2 + "px";
        gameOffset = (window.innerWidth - (window.innerHeight * 4 / 3 * 0.9)) / 2
        document.getElementById("game").style.top = (window.innerHeight - (window.innerHeight * 0.9)) / 2 + "px";
    } else {
        widescreen = false;
        document.getElementById("game").style.width = window.innerWidth * 0.9 + "px";
        gameWidth = window.innerWidth * 0.9;
        document.getElementById("game").style.height = window.innerWidth * 0.675 + "px";
        document.getElementById("game").style.left = window.innerWidth * 0.05 + "px";
        gameOffset = window.innerWidth * 0.05;
        document.getElementById("game").style.top = (window.innerHeight - (window.innerWidth * 0.675)) / 2 + "px";
    }
    document.getElementById("score").style.fontSize = gameWidth / 50 + "px";
    document.getElementById("start").style.fontSize = gameWidth / 50 + "px";
    document.getElementById("infoButton").style.fontSize = gameWidth / 50 + "px";
    document.getElementById("closeInfo").style.fontSize = gameWidth / 50 + "px";
    document.getElementById("info").style.fontSize = gameWidth / 50 + "px";
    document.getElementById("title1").style.fontSize = gameWidth / 25 + "px";
    document.getElementById("title2").style.fontSize = gameWidth / 25 + "px";
}

document.addEventListener(
    "mousemove", (e) => {
        mousePos = (e.clientX - gameOffset) / gameWidth * 100 - 5;
    }
)

document.addEventListener(
    "touchstart", (e) => {
        mousePos = (e.touches[0].clientX - gameOffset) / gameWidth * 100 - 5;
    }
)

document.addEventListener(
    "touchmove", (e) => {
        mousePos = (e.touches[0].clientX - gameOffset) / gameWidth * 100 - 5;
    }
)

function startGame() {
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("title1").style.visibility = "hidden";
    document.getElementById("startScreen").style.visibility = "hidden";
    score = 0;
    switch (String(highscore).length) {
        case 1:
            document.getElementById("score").innerHTML = "HI 000" + highscore + " | 0000";
            break;
        case 2:
            document.getElementById("score").innerHTML = "HI 00" + highscore + " | 0000";
            break;
        case 3:
            document.getElementById("score").innerHTML = "HI 0" + highscore + " | 0000";
            break;
        default:
            document.getElementById("score").innerHTML = "HI " + highscore + " | 0000";
    }
    started = true;
    basketPos = 45;
    document.getElementById("basket").style.left = "45%"
    document.getElementById("basket").style.visibility = "visible";
    document.getElementById("score").style.visibility = "visible";
    speed = { apple: 0.65, basket: 1.4, spawnBase: 50, spawnRandom: 15, tick: 10 }
    spawnTime = Math.random() * speed.spawnRandom + speed.spawnBase + time;
    lastTick = performance.now();
    isSlow = false;
    tickTimer = setInterval(GameLoop, speed.tick);
}

document.addEventListener("selectionstart", () => { document.getSelection().removeAllRanges(); });

function updateScore() {
    score++
    if (score % 20 == 0) {
        speed = { apple: speed.apple / 0.95, basket: speed.basket / 0.95, spawnBase: speed.spawnBase * 0.95, spawnRandom: speed.spawnRandom * 0.95 }
    }
    if (score > highscore) {
        highscore = score;
        document.cookie = "highscore=" + highscore + ";max-age=157784760";
    }
    switch (String(highscore).length) {
        case 1:
            scoreDisplay = "HI 000" + highscore + " | ";
            break;
        case 2:
            scoreDisplay = "HI 00" + highscore + " | ";
            break;
        case 3:
            scoreDisplay = "HI 0" + highscore + " | ";
            break;
        default:
            scoreDisplay = "HI " + highscore + " | ";
            break;
    }
    switch (String(score).length) {
        case 1:
            scoreDisplay = scoreDisplay + "000" + score;
            break;
        case 2:
            scoreDisplay = scoreDisplay + "00" + score;
            break;
        case 3:
            scoreDisplay = scoreDisplay + "0" + score;
            break;
        default:
            scoreDisplay = scoreDisplay + score;
            break;
    }
    document.getElementById("score").innerHTML = scoreDisplay;
}

function gameOver() {
    clearInterval(tickTimer);
    started = false;
    apple1.used = false;
    apple2.used = false;
    apple3.used = false;
    apple4.used = false;
    document.getElementById("apple1").style.visibility = "hidden";
    document.getElementById("apple2").style.visibility = "hidden";
    document.getElementById("apple3").style.visibility = "hidden";
    document.getElementById("apple4").style.visibility = "hidden";
    document.getElementById("basket").style.visibility = "hidden";
    document.getElementById("start").innerHTML = "Play Again";
    document.getElementById("title1").innerHTML = "Game Over!";
    document.getElementById("startScreen").style.visibility = "visible";
    document.getElementById("start").style.visibility = "visible";
    document.getElementById("title1").style.visibility = "visible";
}

function instructions() {
    if (infoOpen) {
        document.getElementById("start").style.visibility = "visible";
        document.getElementById("title1").style.visibility = "visible";
        document.getElementById("startScreen").style.visibility = "visible";
        document.getElementById("closeInfo").style.visibility = "hidden";
        document.getElementById("title2").style.visibility = "hidden";
        document.getElementById("infoWindow").style.visibility = "hidden";
        document.getElementById("info").style.visibility = "hidden";
        infoOpen = false;
    } else {
        document.getElementById("start").style.visibility = "hidden";
        document.getElementById("title1").style.visibility = "hidden";
        document.getElementById("startScreen").style.visibility = "hidden";
        document.getElementById("closeInfo").style.visibility = "visible";
        document.getElementById("title2").style.visibility = "visible";
        document.getElementById("infoWindow").style.visibility = "visible";
        document.getElementById("info").style.visibility = "visible";
        infoOpen = true;
    }
}

function GameLoop() {
    time++;
    if (performance.now() > lastTick + 12.5 && isSlow == false) {
        console.log("Game running slow. Reducing framerate.");
        isSlow = true;
        speed = {
            apple: speed.apple * 2,
            basket: speed.basket * 2,
            spawnBase: speed.spawnBase / 2,
            spawnRandom: speed.spawnRandom / 2,
            tick: speed.tick * 2
        };
        clearInterval(tickTimer);
        tickTimer = setInterval(GameLoop, speed.tick);
    }
    lastTick = performance.now();
    if (spawnTime <= time) {
        if (!apple1.used) {
            apple1.used = true;
            apple1Pos = [Math.random() * 95, 0];
            document.getElementById("apple1").style.left = apple1Pos[0] + "%";
            document.getElementById("apple1").style.top = "0%";
            if (Math.random() < 0.2) {
                apple1.rotten = true;
                document.getElementById("apple1").style.backgroundImage = "url(assets/rotten-apple.webp)";
            } else {
                apple1.rotten = false;
                document.getElementById("apple1").style.backgroundImage = "url(assets/apple.webp)";
            }
            document.getElementById("apple1").style.visibility = "visible";
        } else if (!apple2.used) {
            apple2Pos = [Math.random() * 95, 0];
            apple2.used = true;
            document.getElementById("apple2").style.left = apple2Pos[0] + "%";
            document.getElementById("apple2").style.top = "0%";
            if (Math.random() < 0.2) {
                apple2.rotten = true;
                document.getElementById("apple2").style.backgroundImage = "url(assets/rotten-apple.webp)";
            } else {
                apple2.rotten = false;
                document.getElementById("apple2").style.backgroundImage = "url(assets/apple.webp)";
            }
            document.getElementById("apple2").style.visibility = "visible";
        } else if (!apple3.used) {
            apple3.used = true;
            apple3Pos = [Math.random() * 95, 0];
            document.getElementById("apple3").style.left = apple3Pos[0] + "%";
            document.getElementById("apple3").style.top = "0%";
            if (Math.random() < 0.2) {
                apple3.rotten = true;
                document.getElementById("apple3").style.backgroundImage = "url(assets/rotten-apple.webp)";
            } else {
                apple3.rotten = false;
                document.getElementById("apple3").style.backgroundImage = "url(assets/apple.webp)";
            }
            document.getElementById("apple3").style.visibility = "visible";
        } else if (!apple4.used) {
            apple4.used = true;
            apple4Pos = [Math.random() * 95, 0];
            document.getElementById("apple4").style.left = apple4Pos[0] + "%";
            document.getElementById("apple4").style.top = "0%";
            if (Math.random() < 0.2) {
                apple4.rotten = true;
                document.getElementById("apple4").style.backgroundImage = "url(assets/rotten-apple.webp)";
            } else {
                apple4.rotten = false;
                document.getElementById("apple4").style.backgroundImage = "url(assets/apple.webp)";
            }
            document.getElementById("apple4").style.visibility = "visible";
        }
        spawnTime = Math.random() * speed.spawnRandom + speed.spawnBase + time;
    }
    if (mousePos < basketPos) {
        if (basketPos - mousePos < speed.basket && mousePos >= 0) {
            basketPos = mousePos;
            document.getElementById("basket").style.left = basketPos + "%";
        } else if (basketPos < speed.basket && mousePos < 0) {
            basketPos = 0;
            document.getElementById("basket").style.left = "0%";
        } else if (basketPos - mousePos >= speed.basket && basketPos >= speed.basket) {
            basketPos -= speed.basket;
            document.getElementById("basket").style.left = basketPos + "%";
        }
    } else if (mousePos > basketPos) {
        if (basketPos - mousePos > -speed.basket && mousePos <= 90) {
            basketPos = mousePos
            document.getElementById("basket").style.left = basketPos + "%";
        } else if (basketPos > 90 - speed.basket && mousePos > 90) {
            basketPos = 90;
            document.getElementById("basket").style.left = "90%";
        } else if (basketPos - mousePos <= 90 - speed.basket && basketPos <= 90 - speed.basket) {
            basketPos += speed.basket;
            document.getElementById("basket").style.left = basketPos + "%";
        }
    }
    if (apple1.used) {
        apple1Pos[1] += speed.apple;
        document.getElementById("apple1").style.top = apple1Pos[1] + "%";
    }
    if (apple2.used) {
        apple2Pos[1] += speed.apple;
        document.getElementById("apple2").style.top = apple2Pos[1] + "%";
    }
    if (apple3.used) {
        apple3Pos[1] += speed.apple;
        document.getElementById("apple3").style.top = apple3Pos[1] + "%";
    }
    if (apple4.used) {
        apple4Pos[1] += speed.apple;
        document.getElementById("apple4").style.top = apple4Pos[1] + "%";
    }
    if (basketPos < apple1Pos[0] + (20 / 3) && basketPos + (40 / 3) > apple1Pos[0] && 75 < apple1Pos[1] + (20 / 3) && 75 + (40 / 3) > apple1Pos[1]) {
        apple1Pos = [0, 0];
        apple1.used = false;
        document.getElementById("apple1").style.visibility = "hidden";
        if (!apple1.rotten) {
            updateScore();
        } else {
            gameOver();
        }
    }
    if (basketPos < apple2Pos[0] + (20 / 3) && basketPos + (40 / 3) > apple2Pos[0] && 75 < apple2Pos[1] + (20 / 3) && 75 + (40 / 3) > apple2Pos[1]) {
        apple2Pos = [0, 0];
        apple2.used = false;
        document.getElementById("apple2").style.visibility = "hidden";
        if (!apple2.rotten) {
            updateScore();
        } else {
            gameOver();
        }
    }
    if (basketPos < apple3Pos[0] + (20 / 3) && basketPos + (40 / 3) > apple3Pos[0] && 75 < apple3Pos[1] + (20 / 3) && 75 + (40 / 3) > apple3Pos[1]) {
        apple3Pos = [0, 0];
        apple3.used = false;
        document.getElementById("apple3").style.visibility = "hidden";
        if (!apple3.rotten) {
            updateScore();
        } else {
            gameOver();
        }
    }
    if (basketPos < apple4Pos[0] + (20 / 3) && basketPos + (40 / 3) > apple4Pos[0] && 75 < apple4Pos[1] + (20 / 3) && 75 + (40 / 3) > apple4Pos[1]) {
        apple4Pos = [0, 0];
        apple4.used = false;
        document.getElementById("apple4").style.visibility = "hidden";
        if (!apple4.rotten) {
            updateScore();
        } else {
            gameOver();
        }
    }
    if (apple1Pos[1] >= 100 - (20 / 3)) {
        apple1Pos = [0, 0];
        apple1.used = false;
        document.getElementById("apple1").style.visibility = "hidden";
        if (!apple1.rotten) {
            gameOver();
        }
    }
    if (apple2Pos[1] >= 100 - (20 / 3)) {
        apple2Pos = [0, 0];
        apple2.used = false;
        document.getElementById("apple2").style.visibility = "hidden";
        if (!apple2.rotten) {
            gameOver();
        }
    }
    if (apple3Pos[1] >= 100 - (20 / 3)) {
        apple3Pos = [0, 0];
        apple3.used = false;
        document.getElementById("apple3").style.visibility = "hidden";
        if (!apple3.rotten) {
            gameOver();
        }
    }
    if (apple4Pos[1] >= 100 - (20 / 3)) {
        apple3Pos = [0, 0];
        apple3.used = false;
        document.getElementById("apple4").style.visibility = "hidden";
        if (!apple4.rotten) {
            gameOver();
        }
    }
}
