document.addEventListener("DOMContentLoaded", () => {
    const statusEl = document.getElementById("status");
    const ui = document.getElementById("ui");
    const intro = document.getElementById("intro");
    const arContainer = document.getElementById("arContainer");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const thunder = document.getElementById("thunder");
    const scene = document.getElementById("scene");

    let jokerSound = null;

    // Always start with intro visible, container hidden
    intro.style.display = "flex";
    arContainer.style.display = "none";
    ui.style.display = "none";

    // Clear any stale sessionStorage on fresh page load
    sessionStorage.removeItem("arStart");

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

    startBtn.addEventListener("click", () => {
        intro.style.display = "none";
        arContainer.style.display = "block";
        startBtn.disabled = true;
        startBtn.textContent = "Loading...";
    });

    stopBtn.addEventListener("click", () => {
        stopSound();
        window.location.reload();
    });

    scene.addEventListener("arReady", () => {
        console.log("AR READY");
        ui.style.display = "flex";
        setStatus("Point at the Joker card 🃏");

        const target0 = document.getElementById("target0");
        const joker = document.getElementById("joker");

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

    scene.addEventListener("arError", () => {
        console.log("AR ERROR");
        intro.style.display = "flex";
        arContainer.style.display = "none";
        ui.style.display = "none";
        startBtn.disabled = false;
        startBtn.textContent = "Start Camera";
        setStatus("Camera error — please refresh.");
    });
});