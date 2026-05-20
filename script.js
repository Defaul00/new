/* ═══════════════════════════════════
   SCRIPT.JS — Aditya Fakhri Portfolio
═══════════════════════════════════ */

    // Terminal animation
    const terminalContainer = document.getElementById('terminal-container');
    const terminalBody = document.querySelector('.terminal-body');
    const commandSpan = document.querySelector('.command-text');

    if (terminalContainer && terminalBody && commandSpan) {
        const commandText = "git clone https://github.com/Doctype00/Lumino-web.git";

        let i = 0;
        const typeCommand = () => {
            if (i < commandText.length) {
                commandSpan.textContent += commandText.charAt(i);
                i++;
                setTimeout(typeCommand, 50);
            } else {
                // Add blinking cursor after typing
                const cursor = document.createElement('span');
                cursor.className = 'animate-blink';
                commandSpan.parentElement.appendChild(cursor);
            }
        };

        // Start typing after a delay
        setTimeout(typeCommand, 1000);
    } else {
        // Fallback for original terminal structure
        const terminal = document.querySelector('.terminal-body');
        if (terminal) {
            const commandText = terminal.querySelector('.command').textContent;
            terminal.querySelector('.command').textContent = '';

            let i = 0;
            const typeCommand = () => {
                if (i < commandText.length) {
                    terminal.querySelector('.command').textContent += commandText.charAt(i);
                    i++;
                    setTimeout(typeCommand, 50);
                } else {
                    // Add blinking cursor after typing
                    terminal.querySelector('.command').insertAdjacentHTML('afterend', '<span class="animate-blink">_</span>');
                }
            };

            // Start typing after a delay
            setTimeout(typeCommand, 1000);
        }
    }
// ── NAV SCROLL ──
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ── HERO CANVAS (particles) ──
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - .5) * .4;
    this.vy = (Math.random() - .5) * .4;
    this.r = Math.random() * 2 + .5;
    this.alpha = Math.random() * .5 + .1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(108,99,255,${this.alpha})`;
    ctx.fill();
  }
}

const particles = Array.from({ length: 80 }, () => new Particle());
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // draw lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,99,255,${.08 * (1 - d / 120)})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();


// ── STAT COUNTER ──
document.querySelectorAll('.stat__num').forEach(el => {
  const target = +el.dataset.target;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      let n = 0;
      const step = () => { n += Math.ceil(target / 40); if (n >= target) { el.textContent = target; return; } el.textContent = n; requestAnimationFrame(step); };
      step();
      observer.disconnect();
    }
  }, { threshold: .5 });
  observer.observe(el);
});

// ── SKILL ORB PROGRESS ──
document.querySelectorAll('.skill-orb').forEach(orb => {
  const level = +orb.dataset.level;
  const circle = orb.querySelector('.orb-progress');
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (circumference * level / 100);
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      circle.style.strokeDashoffset = offset;
      observer.disconnect();
    }
  }, { threshold: .3 });
  observer.observe(orb);
});

// ── REVEAL ON SCROLL ──
document.querySelectorAll('.project-card, .experiment, .about__dark-panel, .about__light-panel, .contact__inner').forEach(el => {
  el.classList.add('reveal');
});
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── GENERATIVE ART CANVAS ──
const genCanvas = document.getElementById('genCanvas');
const gctx = genCanvas.getContext('2d');
genCanvas.width = genCanvas.offsetWidth || 400;
genCanvas.height = 220;

class Star {
  constructor(cx, cy) {
    this.cx = cx; this.cy = cy;
    this.x = cx + (Math.random() - .5) * 300;
    this.y = cy + (Math.random() - .5) * 200;
    this.vx = (Math.random() - .5) * 1.5;
    this.vy = (Math.random() - .5) * 1.5;
    this.r = Math.random() * 2 + .5;
    this.hue = Math.random() * 60 + 240;
    this.alpha = Math.random() * .8 + .2;
  }
  update() {
    const dx = this.cx - this.x, dy = this.cy - this.y;
    this.vx += dx * .0003; this.vy += dy * .0003;
    this.vx *= .99; this.vy *= .99;
    this.x += this.vx; this.y += this.vy;
  }
  draw(c) {
    c.beginPath(); c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    c.fillStyle = `hsla(${this.hue},80%,70%,${this.alpha})`;
    c.fill();
  }
}

let stars = [];
function initStars() {
  stars = Array.from({ length: 150 }, () => new Star(genCanvas.width / 2, genCanvas.height / 2));
}
initStars();

function animGen() {
  gctx.fillStyle = 'rgba(10,10,18,.15)';
  gctx.fillRect(0, 0, genCanvas.width, genCanvas.height);
  stars.forEach(s => { s.update(); s.draw(gctx); });
  requestAnimationFrame(animGen);
}
animGen();

genCanvas.addEventListener('click', e => {
  const rect = genCanvas.getBoundingClientRect();
  const ex = e.clientX - rect.left, ey = e.clientY - rect.top;
  stars.forEach(s => {
    const dx = s.x - ex, dy = s.y - ey;
    const d = Math.sqrt(dx * dx + dy * dy) || 1;
    s.vx += (dx / d) * 8; s.vy += (dy / d) * 8;
  });
});

document.getElementById('regenBtn').addEventListener('click', () => {
  gctx.clearRect(0, 0, genCanvas.width, genCanvas.height);
  initStars();
});

// ── MORPH SHAPE ──
const morphShape = document.getElementById('morphShape');
document.querySelectorAll('.morph-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.morph-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    morphShape.className = 'morph-shape ' + btn.dataset.shape;
  });
});

// ── PALETTE GENERATOR ──
function genPalette() {
  const base = Math.random() * 360;
  const colors = [0, 40, 120, 200, 280].map(offset => {
    const h = (base + offset) % 360;
    return `hsl(${h}, ${60 + Math.random() * 30}%, ${45 + Math.random() * 25}%)`;
  });
  const swatches = document.getElementById('paletteSwatches');
  const codes = document.getElementById('paletteCodes');
  swatches.innerHTML = colors.map(c => `<div class="swatch" style="background:${c};"></div>`).join('');
  codes.innerHTML = colors.map(c => `<span>${c}</span>`).join('');
}
document.getElementById('genPalette').addEventListener('click', genPalette);
genPalette();


// ── CONTACT FORM ──
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('formSuccess').classList.add('show');
  e.target.reset();
  setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 4000);
});

// ── SMOOTH SCROLL NAV LINKS ──
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── TYPING SPEED TESTER ──
const typingPrompt = document.getElementById('typingPrompt');
const typingInput = document.getElementById('typingInput');
const startTypingBtn = document.getElementById('startTyping');
const wpmDisplay = document.getElementById('wpmDisplay');
const accDisplay = document.getElementById('accDisplay');
const timeDisplay = document.getElementById('timeDisplay');

const prompts = [
  "Web development is the art of turning coffee into responsive layouts and digital magic.",
  "The quick brown fox jumps over the lazy dog in a spectacular display of agile programming.",
  "Clean code always looks like it was written by someone who cares about their craftsmanship.",
  "A user interface is like a joke. If you have to explain it, it is probably not very good.",
  "Simplicity is the soul of efficiency, especially when scaling modern frontend architectures."
];

let timer = null;
let timeLeft = 30;
let isPlaying = false;
let currentPrompt = "";

function startTypingTest() {
  if (isPlaying) {
    resetTypingTest();
    return;
  }
  
  isPlaying = true;
  timeLeft = 30;
  wpmDisplay.textContent = "0";
  accDisplay.textContent = "100%";
  timeDisplay.textContent = timeLeft + "s";
  
  // Select a random prompt
  currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  typingPrompt.textContent = currentPrompt;
  typingPrompt.style.color = "#fff"; // Make it bright
  
  // Enable & focus textarea
  typingInput.value = "";
  typingInput.disabled = false;
  typingInput.focus();
  
  // Update button
  startTypingBtn.textContent = "Restart Test";
  
  // Start countdown
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft + "s";
    
    if (timeLeft <= 0) {
      endTypingTest();
    }
  }, 1000);
}

function calculateStats() {
  const typedText = typingInput.value;
  const typedWords = typedText.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // WPM
  const timeElapsed = (30 - timeLeft) / 60 || 0.01;
  const wpm = Math.round(typedWords / timeElapsed);
  wpmDisplay.textContent = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
  
  // Accuracy
  let correctChars = 0;
  const minLength = Math.min(typedText.length, currentPrompt.length);
  
  for (let i = 0; i < minLength; i++) {
    if (typedText[i] === currentPrompt[i]) {
      correctChars++;
    }
  }
  
  const accuracy = typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 100;
  accDisplay.textContent = accuracy + "%";
  
  // Visual feedback: check if the user completed the prompt early
  if (typedText === currentPrompt) {
    endTypingTest();
  }
}

function endTypingTest() {
  clearInterval(timer);
  isPlaying = false;
  typingInput.disabled = true;
  startTypingBtn.textContent = "Start Test";
  
  const finalWpm = wpmDisplay.textContent;
  const finalAcc = accDisplay.textContent;
  
  typingPrompt.innerHTML = `🎉 <strong style="color: var(--accent);">Test completed!</strong> WPM: <strong style="color: #fff;">${finalWpm}</strong> | Accuracy: <strong style="color: #fff;">${finalAcc}</strong>`;
}

function resetTypingTest() {
  clearInterval(timer);
  isPlaying = false;
  timeLeft = 30;
  wpmDisplay.textContent = "0";
  accDisplay.textContent = "100%";
  timeDisplay.textContent = "30s";
  typingPrompt.textContent = "Press Start to begin typing test";
  typingPrompt.style.color = "var(--text-muted)";
  typingInput.value = "";
  typingInput.disabled = true;
  startTypingBtn.textContent = "Start Test";
}

if (startTypingBtn && typingInput) {
  startTypingBtn.addEventListener('click', startTypingTest);
  typingInput.addEventListener('input', calculateStats);
}
