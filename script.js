// =========================================================
// OOCL HUB - Animation Canvas : Vagues et Bateau Cargo
// =========================================================

// --- Canvas Setup ---
const canvas = document.getElementById('oceanCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// --- Vagues ---
const waves = [
    { amplitude: 18, wavelength: 0.008, speed: 0.003, yBase: 0.88, color: 'rgba(0, 112, 243, 0.22)', offset: 0 },
    { amplitude: 12, wavelength: 0.010, speed: 0.002, yBase: 0.91, color: 'rgba(0, 180, 216, 0.16)', offset: 30 },
    { amplitude: 8,  wavelength: 0.013, speed: 0.0015, yBase: 0.94, color: 'rgba(0, 223, 216, 0.10)', offset: 60 },
];

function drawWave(wave, time) {
    const h = canvas.height;
    const w = canvas.width;
    const baseY = h * wave.yBase;

    ctx.beginPath();
    ctx.moveTo(0, h);

    for (let x = 0; x <= w; x += 4) {
        const y = baseY + Math.sin(x * wave.wavelength + time * wave.speed + wave.offset) * wave.amplitude;
        ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = wave.color;
    ctx.fill();
}

// --- Bateau Cargo ---
const boat = {
    x: -220,
    y: 0,
    width: 220,
    height: 100,
    speed: 0.6,
    bobOffset: 0,
};

function drawBoat(time) {
    const h = canvas.height;
    const w = canvas.width;

    // Position verticale : tangue doucement sur les vagues
    const bobY = Math.sin(time * 0.018) * 6;
    const tiltAngle = Math.sin(time * 0.018) * 0.03;
    const baseY = h * 0.86 + bobY;

    // Avance le bateau
    boat.x += boat.speed;
    if (boat.x > w + 250) boat.x = -260;

    ctx.save();
    ctx.translate(boat.x + boat.width / 2, baseY);
    ctx.rotate(tiltAngle);
    ctx.globalAlpha = 0.55;

    const s = 1.2; // échelle
    ctx.scale(s, s);

    // --- Coque ---
    ctx.beginPath();
    ctx.moveTo(-95, 10);
    ctx.lineTo(-110, 30);
    ctx.lineTo(110, 30);
    ctx.lineTo(95, 10);
    ctx.closePath();
    ctx.fillStyle = '#1a3a5c';
    ctx.strokeStyle = '#2a6090';
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    // Liserée rouge sur la coque
    ctx.beginPath();
    ctx.moveTo(-97, 15);
    ctx.lineTo(97, 15);
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 3;
    ctx.stroke();

    // --- Pont ---
    ctx.fillStyle = '#1e4575';
    ctx.fillRect(-90, -5, 180, 15);

    // --- Conteneurs rangée basse ---
    const containers1 = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    containers1.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.65;
        ctx.fillRect(-85 + i * 26, -25, 22, 20);
        // Bord du conteneur
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-85 + i * 26, -25, 22, 20);
    });

    // --- Conteneurs rangée haute ---
    const containers2 = ['#e67e22', '#2980b9', '#27ae60', '#8e44ad'];
    containers2.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.55;
        ctx.fillRect(-60 + i * 26, -44, 22, 19);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-60 + i * 26, -44, 22, 19);
    });

    ctx.globalAlpha = 0.55;

    // --- Cabine de pilotage ---
    ctx.fillStyle = '#152d4a';
    ctx.strokeStyle = '#2a6090';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(65, -42, 28, 37, 3);
    ctx.fill();
    ctx.stroke();

    // Fenêtres de la cabine
    ctx.fillStyle = 'rgba(100, 200, 255, 0.35)';
    ctx.fillRect(68, -38, 22, 10);
    ctx.fillRect(68, -24, 22, 8);

    // --- Cheminée ---
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(78, -60, 12, 22);
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(78, -60, 12, 6);

    // --- Fumée (cercles flottants) ---
    const smokeTime = time * 0.005;
    for (let i = 0; i < 4; i++) {
        const progress = ((smokeTime + i * 0.8) % 3) / 3; // 0→1
        const smokeY = -60 - progress * 40;
        const smokeX = 84 + Math.sin(progress * 5) * 8;
        const smokeR = 4 + progress * 8;
        const smokeAlpha = (1 - progress) * 0.2;

        ctx.beginPath();
        ctx.arc(smokeX, smokeY, smokeR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${smokeAlpha})`;
        ctx.fill();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
}

// --- Boucle d'animation ---
function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawWave(waves[2], time); // vague de fond (la plus claire)
    drawWave(waves[1], time);
    drawBoat(time);
    drawWave(waves[0], time); // vague de premier plan (passe devant le bateau)

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// --- Effet d'entrée du hero ---
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            hero.style.transition = 'all 0.8s ease-out';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});
