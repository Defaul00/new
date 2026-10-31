/* ═══════════════════════════════════
   DINO.JS — Chrome-Dino style intro game
   Press SPACE to jump. Crash = game over,
   then a comic wipe reveals the site.
═══════════════════════════════════ */
(function () {
  const intro = document.getElementById('dinoIntro');
  const canvas = document.getElementById('dinoCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('dinoScore');
  const hiEl = document.getElementById('dinoHi');
  const startHint = document.getElementById('dinoStartHint');
  const gameOverEl = document.getElementById('dinoGameOver');

  if (!intro || !canvas) return;

  const W = 560;
  const H = 200;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = false;

  const GROUND_Y = 172;
  const PLAYER_X = 64;
  const CREAM = '#f0ece4';

  const GRAVITY = 0.7;
  const JUMP_V = -5;
  const MAX_JUMPS = 2;

  const dinoImg = new Image();
  dinoImg.src = 'img/alien.png';

  /* ── Pixel cactus sprites (cell = 5px) ── */
  const SPRITES = {
    small: ['..X..', '..X..', '..X..', '.XXX.', '.X.X.', '.X.X.', '.XXX.'],
    tall: [
      '..X..',
      '..X..',
      '..X..',
      '..X..',
      '.XXX.',
      '.X.X.',
      '.X.X.',
      '.X.X.',
      '.XXX.'
    ],
    wide: ['..X...X..', '..X...X..', '..X...X..', '.XXX.XXX.', '.X.X.X.X.', '.X.X.X.X.', '.XXX.XXX.']
  };

  function makeSprite(rows, cell) {
    return { w: rows[0].length * cell, h: rows.length * cell, rows, cell };
  }
  const sprites = {
    small: makeSprite(SPRITES.small, 6),
    tall: makeSprite(SPRITES.tall, 6),
    wide: makeSprite(SPRITES.wide, 6)
  };

  function drawSprite(s, x, y) {
    ctx.fillStyle = CREAM;
    for (let i = 0; i < s.rows.length; i++) {
      for (let j = 0; j < s.rows[i].length; j++) {
        if (s.rows[i][j] === 'X') {
          ctx.fillRect(x + j * s.cell, y + i * s.cell, s.cell, s.cell);
        }
      }
    }
  }

  /* ── State ── */
  let state = 'ready';
  let score = 0;
  let hiScore = 0;
  let speed = 5;
  let groundX = 0;
  let obstacles = [];
  let spawnTimer = 0;
  let rafId = null;

  const player = { y: GROUND_Y - 70, w: 76, h: 70, vy: 0, jumps: 0 };

  function reset() {
    score = 0;
    speed = 5;
    obstacles = [];
    spawnTimer = 60;
    groundX = 0;
    player.y = GROUND_Y - player.h;
    player.vy = 0;
    player.jumps = 0;
    gameOverEl.classList.remove('show');
    intro.classList.remove('flash');
  }

  function jump() {
    if (state === 'ready') {
      state = 'running';
      startHint.style.display = 'none';
      return;
    }
    if (state !== 'running') return;
    if (player.jumps < MAX_JUMPS) {
      player.vy = JUMP_V;
      player.jumps++;
    }
  }

  function spawnObstacle() {
    const roll = Math.random();
    let key = 'small';
    if (roll < 0.15) key = 'wide';
    else if (roll < 0.4) key = 'tall';
    const s = sprites[key];
    obstacles.push({ x: W + 10, y: GROUND_Y - s.h, sprite: s });
  }

  function crash() {
    state = 'dead';
    hiScore = Math.max(hiScore, Math.floor(score));
    hiEl.textContent = String(hiScore).padStart(5, '0');
    intro.classList.add('flash');
    setTimeout(() => gameOverEl.classList.add('show'), 150);
    setTimeout(() => {
      intro.classList.add('leaving');
      setTimeout(() => {
        intro.classList.add('hidden');
        intro.classList.remove('leaving', 'flash');
        document.body.style.overflow = '';
        cleanup();
      }, 950);
    }, 1600);
  }

  function update() {
    if (state === 'running') {
      score += speed * 0.06;
      speed = Math.min(13, 5 + score / 280);
      groundX = (groundX - speed + 24) % 24;

      player.vy += GRAVITY;
      player.y += player.vy;
      if (player.y > GROUND_Y - player.h) {
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.jumps = 0;
      }

      spawnTimer -= 1;
      if (spawnTimer <= 0) {
        spawnObstacle();
        spawnTimer = Math.max(42, 105 - Math.floor(score / 20));
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= speed;
        if (obstacles[i].x + obstacles[i].sprite.w < -10) obstacles.splice(i, 1);
      }

      const pb = {
        x: PLAYER_X + 12,
        y: player.y + 10,
        w: player.w - 24,
        h: player.h - 18
      };
      for (const ob of obstacles) {
        const obb = {
          x: ob.x + 5,
          y: ob.y + 5,
          w: ob.sprite.w - 10,
          h: ob.sprite.h - 10
        };
        if (
          pb.x < obb.x + obb.w &&
          pb.x + pb.w > obb.x &&
          pb.y < obb.y + obb.h &&
          pb.y + pb.h > obb.y
        ) {
          crash();
          break;
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = 'rgba(240,236,228,0.14)';
    for (let x = groundX - 24; x < W + 24; x += 24) {
      ctx.fillRect(x, GROUND_Y, 10, 2);
    }
    ctx.fillStyle = 'rgba(240,236,228,0.65)';
    ctx.fillRect(0, GROUND_Y, W, 3);

    for (const ob of obstacles) drawSprite(ob.sprite, ob.x, ob.y);

    const drawY = player.y + 3;
    if (dinoImg.complete && dinoImg.naturalWidth > 0) {
      const sw = dinoImg.naturalWidth;
      const sh = dinoImg.naturalHeight;
      const scale = Math.min(player.w / sw, player.h / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = PLAYER_X + (player.w - dw) / 2;
      const dy = drawY + (player.h - dh) / 2;
      ctx.drawImage(dinoImg, 0, 0, sw, sh, dx, dy, dw, dh);
    } else {
      ctx.fillStyle = CREAM;
      ctx.fillRect(PLAYER_X, drawY, player.w, player.h);
    }

    if (state === 'running' || state === 'dead') {
      scoreEl.textContent = String(Math.floor(score)).padStart(5, '0');
    }
  }

  function loop() {
    update();
    draw();
    rafId = requestAnimationFrame(loop);
  }

  function onKey(e) {
    if (intro.classList.contains('hidden')) return;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      if (state === 'dead') return;
      jump();
    }
  }

  function onPointer(e) {
    if (intro.classList.contains('hidden')) return;
    if (state === 'dead') return;
    e.preventDefault();
    jump();
  }

  function cleanup() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('keydown', onKey);
    intro.removeEventListener('pointerdown', onPointer);
  }

  document.body.style.overflow = 'hidden';
  reset();
  window.addEventListener('keydown', onKey);
  intro.addEventListener('pointerdown', onPointer);
  loop();
})();