let tanks = [];
let bullets;
const tankSpeed = 3;
const tankRotationSpeed = 0.05;
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
    bodyAngle: 0,
    turretAngle: 0
  });
  // Player 2 (Arrow Keys)
  tanks.push({
    x: width * 3 / 4,
    y: height / 2,
    w: 50,
    h: 40,
    bodyAngle: PI,
    turretAngle: PI
  });
  bullets = [];
  rectMode(CENTER);
}

function draw() {
  background(0);

  handleInput();

  updateBullets();
  drawTanks();
  drawBullets();
}

function handleInput() {
  // Player 1 Controls (WASD, B, N)
  if (keyIsDown(87)) { // W - forward
    tanks[0].x += tankSpeed * cos(tanks[0].bodyAngle);
    tanks[0].y += tankSpeed * sin(tanks[0].bodyAngle);
  }
  if (keyIsDown(83)) { // S - backward
    tanks[0].x -= tankSpeed * cos(tanks[0].bodyAngle);
    tanks[0].y -= tankSpeed * sin(tanks[0].bodyAngle);
  }
  if (keyIsDown(65)) { // A - rotate left
    tanks[0].bodyAngle -= tankRotationSpeed;
  }
  if (keyIsDown(68)) { // D - rotate right
    tanks[0].bodyAngle += tankRotationSpeed;
  }
  if (keyIsDown(66)) { // B key
    tanks[0].turretAngle -= turretSpeed;
  }
  if (keyIsDown(78)) { // N key
    tanks[0].turretAngle += turretSpeed;
  }
  // Player 2 Controls (Arrow Keys, 2, 3)
  if (keyIsDown(UP_ARROW)) { // Forward
    tanks[1].x += tankSpeed * cos(tanks[1].bodyAngle);
    tanks[1].y += tankSpeed * sin(tanks[1].bodyAngle);
  }
  if (keyIsDown(DOWN_ARROW)) { // Backward
    tanks[1].x -= tankSpeed * cos(tanks[1].bodyAngle);
    tanks[1].y -= tankSpeed * sin(tanks[1].bodyAngle);
  }
  if (keyIsDown(LEFT_ARROW)) { // Rotate left
    tanks[1].bodyAngle -= tankRotationSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) { // Rotate right
    tanks[1].bodyAngle += tankRotationSpeed;
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
  let bullet = {
    x: tank.x,
    y: tank.y,
    angle: tank.turretAngle
  };
  bullets.push(bullet);
}

function drawTanks() {
  for (let tank of tanks) {
    // Tank Body
    push();
    translate(tank.x, tank.y);
    rotate(tank.bodyAngle);
    stroke('green');
    strokeWeight(2);
    fill(0);
    rect(0, 0, tank.w, tank.h);
    pop();
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
    bullets[i].x += bulletSpeed * cos(bullets[i].angle);
    bullets[i].y += bulletSpeed * sin(bullets[i].angle);

    // Remove bullets that go off-screen
    if (bullets[i].x < 0 || bullets[i].x > width || bullets[i].y < 0 || bullets[i].y > height) {
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