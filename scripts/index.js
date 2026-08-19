let allQuotesData = null;
let remainingKeys = [];

async function getData() {
    const dataGist = await fetch("https://gist.githubusercontent.com/Linkernel0x/30584121b4e364db49caf0e483f2cecb/raw/sillyData.json");
    return await dataGist.json();
}

function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

async function renderPage() {
    loadBoop();
    loadKorok();

    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    const version = document.getElementById("version");

    if (!quoteText || !quoteAuthor) return;

    try {
        if (!allQuotesData) {
            const data = await getData();
            if (version && data.version) version.innerHTML = "v" + data.version;
            if (!data || !data.quotes) return;
            allQuotesData = data.quotes;
        }

        if (remainingKeys.length === 0) {
            const keys = Object.keys(allQuotesData);
            remainingKeys = shuffle([...keys]);
        }

        const randomKey = remainingKeys.pop();
        const quote = allQuotesData[randomKey];

        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
    } catch (error) {
        console.error("Error while fetching data:", error);
    }
}

async function loadBoop() {
    let boopCount = 0;
    const boopBox = document.getElementById('boop-box');
    if (boopBox) {
        boopBox.addEventListener('click', (e) => {
            boopCount++;
            document.getElementById('boop-counter').textContent = boopCount.toString();
            const rect = e.target.getBoundingClientRect();
            if (boopCount % 10 === 0) makeConfetti(rect.left, rect.top, 20);
        });
    }
}

function rand(min, max) { return Math.random() * (max - min) + min; }

function makeConfetti(x, y, amount = 50) {
    const canvas = document.getElementById('confetti');
    if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        let particles = [];

        for (let i = 0; i < amount; i++) {
            particles.push({
                x, y,
                vx: rand(-8, 8),
                vy: rand(-12, -2),
                r: rand(5, 10),
                col: `hsl(${rand(0, 360)}, 80%, 60%)`,
                gravity: 0.3
            });
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.col;
                ctx.fill();

                if (p.y > H) particles.splice(index, 1);
            });

            if (particles.length > 0) {
                requestAnimationFrame(draw);
            }
        }
        draw();
    }
}

async function loadKorok() {
    const korok = document.getElementById('secret-korok');
    const dialog = document.getElementById('korok-dialog');
    const closeButton = document.getElementById('close-button');

    if (!korok || !dialog || !closeButton) return;

    korok.addEventListener('click', () => {
        dialog.showModal();
        makeConfetti(window.innerWidth / 2, window.innerHeight / 2, 200);
        korok.style.display = 'none';
    });

    closeButton.addEventListener('click', () => {
        dialog.close();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) return;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.documentElement.classList.add("light-mode");
        toggleBtn.querySelector("i").className = "fa-solid fa-sun";
    }

    toggleBtn.addEventListener("click", () => {
        document.documentElement.classList.toggle("light-mode");
        const isLight = document.documentElement.classList.contains("light-mode");

        const icon = toggleBtn.querySelector("i");
        icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";

        localStorage.setItem("theme", isLight ? "light" : "dark");
    });
});

document.addEventListener("DOMContentLoaded", renderPage);