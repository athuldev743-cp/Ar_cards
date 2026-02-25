document.addEventListener("DOMContentLoaded", () => {
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
    let firstLoad = true;

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

    const showAR = () => {
        intro.style.display = "none";
        ui.style.display = "flex";
        arReady = true;
        setStatus("Point at the Joker card 🃏");
    };

    startBtn.addEventListener("click", async () => {
        startBtn.textContent = "Loading...";
        startBtn.disabled = true;
        arContainer.style.display = "block";

        if (!firstLoad) {
            // Scene already initialized, manually start arSystem
            const scene = document.getElementById("scene");

            // Wait for systems to be available
            await new Promise(resolve => setTimeout(resolve, 500));

            const arSystem = scene.systems["mindar-image-system"];
            if (arSystem) {
                try {
                    await arSystem.start();
                    showAR();
                } catch (e) {
                    console.error(e);
                    setStatus("Camera error — please refresh.");
                    startBtn.textContent = "Start Camera";
                    startBtn.disabled = false;
                    arContainer.style.display = "none";
                    intro.style.display = "flex";
                }
            }
        }
        // firstLoad: wait for arReady event to fire naturally
    });

    const scene = document.getElementById("scene");

    scene.addEventListener("arReady", () => {
        firstLoad = false;
        showAR();
    });

    scene.addEventListener("arError", () => {
        setStatus("Camera error — please refresh.");
        startBtn.textContent = "Start Camera";
        startBtn.disabled = false;
        arContainer.style.display = "none";
        intro.style.display = "flex";
    });

    stopBtn.addEventListener("click", async () => {
        const arSystem = scene.systems["mindar-image-system"];
        if (arSystem && arReady) {
            await arSystem.stop();
            arReady = false;
        }
        stopSound();
        joker.setAttribute("visible", "false");
        arContainer.style.display = "none";
        ui.style.display = "none";
        intro.style.display = "flex";
        startBtn.textContent = "Start Camera";
        startBtn.disabled = false;
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
        stopSound();
        joker.setAttribute("visible", "false");
        setStatus("Point at the Joker card 🃏");
    });
}); 