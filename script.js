document.addEventListener("DOMContentLoaded", () => {
    const statusEl = document.getElementById("status");
    const ui = document.getElementById("ui");
    const intro = document.getElementById("intro");
    const arContainer = document.getElementById("arContainer");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const thunder = document.getElementById("thunder");
    const scene = document.getElementById("scene");

    let arReady = false;
    let jokerSound = null;
    let firstLoad = true;
    let listenersAdded = false;

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

    const addTargetListeners = () => {
        if (listenersAdded) return;
        listenersAdded = true;

        const target0 = document.getElementById("target0");
        const joker = document.getElementById("joker");

        if (!target0 || !joker) {
            // retry if not ready yet
            setTimeout(addTargetListeners, 300);
            listenersAdded = false;
            return;
        }

        console.log("Adding target listeners");

        target0.addEventListener("targetFound", () => {
            console.log("TARGET FOUND");
            const j = document.getElementById("joker");
            triggerThunder();
            playSound();
            j.setAttribute("visible", "true");
            setStatus("🃏 The Joker appears!", true);
        });

        target0.addEventListener("targetLost", () => {
            console.log("TARGET LOST");
            const j = document.getElementById("joker");
            stopSound();
            j.setAttribute("visible", "false");
            setStatus("Point at the Joker card 🃏");
        });
    };

    const showAR = () => {
        intro.style.display = "none";
        ui.style.display = "flex";
        arReady = true;
        setStatus("Point at the Joker card 🃏");
        addTargetListeners();
    };

    startBtn.addEventListener("click", async () => {
        startBtn.textContent = "Loading...";
        startBtn.disabled = true;
        arContainer.style.display = "block";

        if (!firstLoad) {
            await new Promise(resolve => setTimeout(resolve, 800));
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
    });

    scene.addEventListener("arReady", () => {
        console.log("AR READY");
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
        const joker = document.getElementById("joker");
        if (joker) joker.setAttribute("visible", "false");
        arContainer.style.display = "none";
        ui.style.display = "none";
        intro.style.display = "flex";
        startBtn.textContent = "Start Camera";
        startBtn.disabled = false;
        listenersAdded = false; // reset so listeners re-added on next start
    });
});