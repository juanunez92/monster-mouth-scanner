let started = false;
let startButton;
let scaryAudio;
let video;
let cameraReady = false;

let faceMesh;
let faces = [];

let mouthOpen = false;
let mouthTop, mouthBottom;

let particles = [];
let cleaningProgress = 0;

// función que recibe los datos de la cara
function gotFaces(results) {
  faces = results;
}

async function setup() {
  createCanvas(windowWidth, windowHeight);

  // sonido de inicio
  scaryAudio = new Audio("spooky.mp3");
  scaryAudio.volume = 0.4;

  // botón inicial
  startButton = createButton("INICIAR ESCÁNER");
  startButton.parent("ui");
  startButton.id("startBtn");

  startButton.mousePressed(async () => {
    startButton.hide();

    let ui = document.getElementById("ui");
    let loadingScreen = document.getElementById("loadingScreen");
    let title = document.getElementById("appTitle");

    if (ui) ui.style.display = "none";
    if (loadingScreen) loadingScreen.style.display = "block";
    if (title) title.style.display = "block";

    scaryAudio.currentTime = 0;
    scaryAudio.play();

    // activamos cámara
    video = createCapture(VIDEO, async () => {
      cameraReady = true;

      faceMesh = await ml5.faceMesh();
      faceMesh.detectStart(video, gotFaces);

      if (loadingScreen) loadingScreen.style.display = "none";
      started = true;
    });

    video.size(1280, 720);
    video.hide();
  });
}

function draw() {
  background("#05010a");

  if (!started) return;

  let camWidth = 700;
  let camHeight = 400;
  let camX = width / 2 - camWidth / 2;
  let camY = height / 2 - camHeight / 2;

  // fondo del recuadro
  fill(0);
  noStroke();
  rect(camX, camY, camWidth, camHeight, 15);

  // dibujar cámara
  if (cameraReady && video) {
    image(video, camX, camY, camWidth, camHeight);
  }

  // marco verde
  noFill();
  stroke("#7cff00");
  strokeWeight(4);
  rect(camX, camY, camWidth, camHeight, 15);

  // barra de limpieza (arriba)
  if (mouthOpen) {
    cleaningProgress += 0.8;
  } else {
    cleaningProgress -= 0.15;
  }

  cleaningProgress = constrain(cleaningProgress, 0, 100);

  let barW = 280;
  let barH = 20;
  let barX = camX + camWidth / 2 - barW / 2;
  let barY = camY + camHeight - 55;

  // fondo UI dentro de la cámara
  fill(0, 0, 0, 140);
  noStroke();
  rect(camX + 20, camY + camHeight - 95, camWidth - 40, 70, 12);

  // texto barra
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Nivel de limpieza", width / 2, camY + camHeight - 72);

  // fondo barra
  fill("#222");
  stroke("#fff");
  strokeWeight(2);
  rect(barX, barY, barW, barH, 10);

  // progreso
  noStroke();
  fill("#7cff00");
  rect(barX + 2, barY + 2, (barW - 4) * (cleaningProgress / 100), barH - 4, 8);

  // porcentaje
  fill("#fff");
  textSize(14);
  text(Math.round(cleaningProgress) + "%", width / 2, camY + camHeight - 28);

  // detección facial
  if (faces.length > 0 && video) {
    let face = faces[0];

    mouthTop = face.keypoints[13];
    mouthBottom = face.keypoints[14];

    let d = dist(mouthTop.x, mouthTop.y, mouthBottom.x, mouthBottom.y);
    mouthOpen = d > 22;

    let mappedMouthX = camX + (mouthBottom.x / video.width) * camWidth;
    let mappedMouthY = camY + (mouthBottom.y / video.height) * camHeight;

    // mensajes según estado
    fill("#ffffff");
    textSize(18);

    if (cleaningProgress >= 100) {
      text("¡Limpieza completada!", width / 2, camY + 35);
    } else if (mouthOpen) {
      text("¡Limpieza en progreso!", width / 2, camY + 35);
    } else {
      text("Abre la boca para comenzar", width / 2, camY + 35);
    }

    if (mouthOpen) {
      // burbujas
      createBubbles(mappedMouthX, mappedMouthY);

      // animación fantasmas
      let offset = sin(frameCount * 0.18) * 10;

      drawGhost(mappedMouthX - 95, mappedMouthY + offset);
      drawGhost(mappedMouthX + 95, mappedMouthY - offset);

      // líneas de cepillado
      stroke("#7cff00");
      strokeWeight(4);

      line(mappedMouthX - 55, mappedMouthY + offset, mappedMouthX - 15, mappedMouthY);
      line(mappedMouthX + 55, mappedMouthY - offset, mappedMouthX + 15, mappedMouthY);

      noStroke();
      fill("#ffffff");
      rect(mappedMouthX - 18, mappedMouthY - 6, 8, 12, 3);
      rect(mappedMouthX + 10, mappedMouthY - 6, 8, 12, 3);
    }

  } else {
    mouthOpen = false;
  }

  // partículas
  updateParticles();
}

// crear burbujas
function createBubbles(x, y) {
  for (let i = 0; i < 3; i++) {
    particles.push({
      x: x + random(-10, 10),
      y: y + random(-5, 5),
      vx: random(-1, 1),
      vy: random(-2, -0.5),
      size: random(8, 16),
      alpha: 255
    });
  }
}

// actualizar burbujas
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 3;

    fill(255, 255, 255, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.size);

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

// dibujar fantasma simple
function drawGhost(x, y) {
  push();
  translate(x, y);

  noStroke();
  fill(255, 255, 255, 230);

  ellipse(0, -20, 50, 50);
  rectMode(CENTER);
  rect(0, 10, 50, 50, 12);

  ellipse(-16, 32, 18, 18);
  ellipse(0, 36, 18, 18);
  ellipse(16, 32, 18, 18);

  fill(0);
  ellipse(-8, -22, 6, 10);
  ellipse(8, -22, 6, 10);
  ellipse(0, -8, 8, 6);

  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}