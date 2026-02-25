document.addEventListener("DOMContentLoaded", () => {
    const scene = document.getElementById("scene");
    const joker = document.getElementById("joker");
    const target0 = document.getElementById("target0");
    const statusEl = document.getElementById("status");
    const overlay = document.getElementById("overlay");
    const ui = document.getElementById("ui");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");

    let arSystem = null;

    const setStatus = (m) => {
        statusEl.textContent = m;
        console.log("[AR]", m);
    };

    // Get arSystem once scene is loaded — exactly as official docs show
    scene.addEventListener("loaded", () => {
        arSystem = scene.systems["mindar-image-system"];
        setStatus("Ready");
    });

    scene.addEventListener("arReady", () => {
        setStatus("Point at the Joker card.");
    });

    scene.addEventListener("arError", () => {
        setStatus("Camera error. Please refresh.");
    });

    target0.addEventListener("targetFound", () => {
        joker.setAttribute("visible", "true");
        setStatus("Joker found ✅");
    });

    target0.addEventListener("targetLost", () => {
        joker.setAttribute("visible", "false");
        setStatus("Scanning...");
    });

    startBtn.addEventListener("click", async () => {
        if (!arSystem) {
            setStatus("Still loading, please wait...");
            return;
        }
        setStatus("Starting camera...");
        overlay.style.display = "none";
        ui.style.display = "flex";
        await arSystem.start();
    });

    stopBtn.addEventListener("click", async () => {
        if (arSystem) await arSystem.stop();
        overlay.style.display = "flex";
        ui.style.display = "none";
        setStatus("Ready");
    });
});