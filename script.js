document.addEventListener("DOMContentLoaded", () => {
    const scene = document.getElementById("scene");
    const joker = document.getElementById("joker");
    const target0 = document.getElementById("target0");
    const statusEl = document.getElementById("status");
    const ui = document.getElementById("ui");
    const intro = document.getElementById("intro");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const thunder = document.getElementById("thunder");

    let jokerSound = null;

    const setStatus = (m, found = false) => {
        statusEl.textContent = m;
        statusEl.className = found ? "pill found" : "pill";
        console.log("[AR]", m);
    };

    const triggerThunder = () => {
        thunder.classList.remove("flash");
        void thunder.offsetWidth;
        thunder.classList.add("flash");
    };

    const playSound = () => {
        if (!jokerSound) jokerSound = document.getElementById("jokerSound");
        if (jokerSound) {
            jokerSound.currentTime = 0;
            jokerSound.play().catch(() => {});
        }
    };

    const stopSound = () => {
        if (jokerSound) {
            jokerSound.pause();
            jokerSound.currentTime = 0;
        }
    };

    // AR loads in background, show intro on top
    // When AR is ready, enable the start button
    scene.addEventListener("arReady", () => {
        console.log("AR READY");
        startBtn.disabled = false;
        startBtn.textContent = "Start AR";
    });

    scene.addEventListener("arError", () => {
        console.log("AR ERROR");
        startBtn.textContent = "Camera Error - Refresh";
    });

    // Start button just hides intro — camera already running
    startBtn.addEventListener("click", () => {
        intro.style.display = "none";
        ui.style.display = "flex";
        setStatus("Point at the Joker card 🃏");
    });

    // Stop button shows intro again
    stopBtn.addEventListener("click", () => {
        stopSound();
        joker.setAttribute("visible", "false");
        intro.style.display = "flex";
        ui.style.display = "none";
        startBtn.disabled = false;
        startBtn.textContent = "Start AR";
        setStatus("Point at the Joker card 🃏");
    });

    target0.addEventListener("targetFound", () => {
        console.log("TARGET FOUND");
        triggerThunder();
        playSound();
        joker.setAttribute("visible", "true");
        setStatus("🃏 The Joker appears!", true);
    });

    target0.addEventListener("targetLost", () => {
        console.log("TARGET LOST");
        stopSound();
        joker.setAttribute("visible", "false");
        setStatus("Point at the Joker card 🃏");
    });
});