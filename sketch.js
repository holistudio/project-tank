let tanks = [];
let bullets;
let gridState = [];
const gridCols = 10;
const gridRows = 10;
const tankSpeed = 3;
const turretSpeed = 0.05;
const bulletSpeed = 7;

function setup() {
  createCanvas(1000, 1000);
  // Player 1 (WASD)
  tanks.push({
    x: width / 4,
    y: height / 2,
    w: 50,
    h: 40,
    player: 1,
    turretAngle: 0
  });
  // Player 2 (Arrow Keys)
  tanks.push({
    x: width * 3 / 4,
    y: height / 2,
    w: 50,
    h: 40,
    player: 2,
    turretAngle: PI
  });
  bullets = [];
  rectMode(CENTER);

  // Initialize grid state
  for (let i = 0; i < gridCols; i++) {
    gridState[i] = [];
    for (let j = 0; j < gridRows; j++) {
      gridState[i][j] = 0; // 0 means not colored, otherwise it's a timestamp
    }
  }
}

function draw() {
  background(0);

  drawGrid();

  handleInput();

  updateBullets();
  drawTanks();
  drawBullets();
}

function handleInput() {
  // Player 1 Controls (WASD, B, N)
  if (keyIsDown(87)) { // W
    tanks[0].y -= tankSpeed;
  }
  if (keyIsDown(83)) { // S
    tanks[0].y += tankSpeed;
  }
  if (keyIsDown(65)) { // A
    tanks[0].x -= tankSpeed;
  }
  if (keyIsDown(68)) { // D
    tanks[0].x += tankSpeed;
  }
  if (keyIsDown(66)) { // B key
    tanks[0].turretAngle -= turretSpeed;
  }
  if (keyIsDown(78)) { // N key
    tanks[0].turretAngle += turretSpeed;
  }

  // Player 2 Controls (Arrow Keys, 2, 3)
  if (keyIsDown(UP_ARROW)) {
    tanks[1].y -= tankSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    tanks[1].y += tankSpeed;
  }
  if (keyIsDown(LEFT_ARROW)) {
    tanks[1].x -= tankSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    tanks[1].x += tankSpeed;
  }
  if (keyIsDown(99)) { // Numpad 3
    tanks[1].turretAngle -= turretSpeed;
  }
  if (keyIsDown(98)) { // Numpad 2
    tanks[1].turretAngle += turretSpeed;
  }

  // Screen wrapping for both tanks
  for (let tank of tanks) {
    if (tank.x > width + tank.w / 2) {
      tank.x = -tank.w / 2;
    } else if (tank.x < -tank.w / 2) {
      tank.x = width + tank.w / 2;
    }

    if (tank.y > height + tank.h / 2) {
      tank.y = -tank.h / 2;
    } else if (tank.y < -tank.h / 2) {
      tank.y = height + tank.h / 2;
    }
  }
}

function keyPressed() {
  // Player 1 Fire
  if (key === 'v' || key === 'V') {
    fireBullet(tanks[0]);
  }

  // Player 2 Fire
  if (keyCode === 97) { // Numpad 1
    fireBullet(tanks[1]);
  }
}

function fireBullet(tank) {
  const gridSize = 100;
  let bullet = {
    x: tank.x,
    y: tank.y,
    angle: tank.turretAngle,
    owner: tank.player
  };

  // Store the grid location at the time of firing
  bullet.originGridX = floor(tank.x / gridSize);
  bullet.originGridY = floor(tank.y / gridSize);

  bullets.push(bullet);
}

function drawGrid() {
  const gridSize = 100;
  push(); // Isolate drawing styles
  rectMode(CORNER); // Use corner mode for grid drawing

  // Draw filled squares
  noStroke();
  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      const timestamp = gridState[i][j];
      if (timestamp > 0) {
        const timePassed = millis() - timestamp;
        if (timePassed >= 5000) {
          // After 5 seconds, become fully opaque
          fill(0, 255, 0);
        } else {
          // Before 5 seconds, stay transparent
          fill(0, 255, 0, 64); // Green with 75% transparency (25% opacity)
        }
        rect(i * gridSize, j * gridSize, gridSize, gridSize);
      }
    }
  }

  // Draw grid lines
  stroke('green');
  strokeWeight(1);
  for (let x = gridSize; x < width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = gridSize; y < height; y += gridSize) {
    line(0, y, width, y);
  }
  pop(); // Restore original drawing styles (including rectMode)
}

function drawTanks() {
  for (let tank of tanks) {
    // Tank Body
    stroke('green');
    strokeWeight(2);
    fill(0);
    rect(tank.x, tank.y, tank.w, tank.h);

    // Turret
    push();
    translate(tank.x, tank.y);
    rotate(tank.turretAngle);
    fill(0);
    stroke('green');
    ellipse(0, 0, 30, 30); // Turret base
    line(0, 0, 40, 0); // Turret barrel
    pop();
  }
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let bullet = bullets[i];

    // Check for collision with neighboring squares
    const gridSize = 100;
    let bulletGridX = floor(bullet.x / gridSize);
    let bulletGridY = floor(bullet.y / gridSize);

    // Check if the bullet is in a neighboring square (but not the center one)
    const inNeighborSquare = Math.abs(bulletGridX - bullet.originGridX) <= 1 && Math.abs(bulletGridY - bullet.originGridY) <= 1;
    const inCenterSquare = bulletGridX === bullet.originGridX && bulletGridY === bullet.originGridY;

    if (inNeighborSquare && !inCenterSquare) {
      // If the cell hasn't been hit before, record the time
      if (gridState[bulletGridX][bulletGridY] === 0) {
        gridState[bulletGridX][bulletGridY] = millis();
      }
      bullets.splice(i, 1);
      continue; // Skip to the next bullet
    }

    bullet.x += bulletSpeed * cos(bullet.angle);
    bullet.y += bulletSpeed * sin(bullet.angle);

    // Remove bullets that go off-screen
    if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
      bullets.splice(i, 1);
    }
  }
}

function drawBullets() {
  stroke('green');
  strokeWeight(3);
  for (let bullet of bullets) {
    push();
    translate(bullet.x, bullet.y);
    rotate(bullet.angle);
    line(0, 0, 10, 0); // Draw bullet as a short line
    pop();
  }
}