document.addEventListener("DOMContentLoaded", () => {
    const scene = document.getElementById("scene");
    const joker = document.getElementById("joker");
    const target0 = document.getElementById("target0");
    const statusEl = document.getElementById("status");
    const ui = document.getElementById("ui");
    const intro = document.getElementById("intro");
    const arContainer = document.getElementById("arContainer");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const thunder = document.getElementById("thunder");

    let arReady = false;
    let jokerSound = null;

    const setStatus = (m, found = false) => {
        statusEl.textContent = m;
        statusEl.className = found ? "pill found" : "pill";
        console.log("[AR]", m);
    };

    // Thunder flash effect
    const triggerThunder = () => {
        thunder.classList.remove("flash");
        void thunder.offsetWidth; // force reflow to restart animation
        thunder.classList.add("flash");
    };

    // Play joker sound
    const playSound = () => {
        if (!jokerSound) {
            jokerSound = document.getElementById("jokerSound");
        }
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

    // START button — show AR container and let MindAR init
    startBtn.addEventListener("click", () => {
        startBtn.textContent = "Loading...";
        startBtn.disabled = true;
        arContainer.style.display = "block";
    });

    // AR is live
    scene.addEventListener("arReady", () => {
        arReady = true;
        intro.style.display = "none";
        ui.style.display = "flex";
        setStatus("Point at the Joker card 🃏");
    });

    scene.addEventListener("arError", () => {
        setStatus("Camera error — please refresh.");
        startBtn.textContent = "Start Camera";
        startBtn.disabled = false;
        arContainer.style.display = "none";
    });

    // STOP button — go back to intro
    stopBtn.addEventListener("click", () => {
        const arSystem = scene.systems["mindar-image-system"];
        if (arSystem && arReady) {
            arSystem.stop();
            arReady = false;
        }
        stopSound();
        joker.setAttribute("visible", "false");
        arContainer.style.display = "none";
        ui.style.display = "none";
        intro.style.display = "flex";
        startBtn.textContent = "Start Camera";
        startBtn.disabled = false;
    });

    // Joker found — thunder + sound + model
    target0.addEventListener("targetFound", () => {
        console.log("TARGET FOUND");
        triggerThunder();
        playSound();
        joker.setAttribute("visible", "true");
        setStatus("🃏 The Joker appears!", true);
    });

    target0.addEventListener("targetLost", () => {
        stopSound();
        joker.setAttribute("visible", "false");
        setStatus("Point at the Joker card 🃏");
    });
});