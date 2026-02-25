document.addEventListener("DOMContentLoaded", () => {
    const scene = document.getElementById("scene");
    const joker = document.getElementById("joker");
    const target0 = document.getElementById("target0");
    const statusEl = document.getElementById("status");
    const overlay = document.getElementById("overlay");
    const ui = document.getElementById("ui");
    const container = document.querySelector(".container");
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");

    let arStarted = false;

    const setStatus = (m, found = false) => {
        statusEl.textContent = m;
        statusEl.className = found ? "pill found" : "pill";
        console.log("[AR]", m);
    };

    // Start camera when button clicked
    startBtn.addEventListener("click", () => {
        container.style.display = "block"; // show the a-scene/camera
        startBtn.disabled = true;
        startBtn.textContent = "Starting...";
    });

    // AR is live
    scene.addEventListener("arReady", () => {
        arStarted = true;
        overlay.style.display = "none";
        ui.style.display = "flex";
        setStatus("Point at the Joker card 🃏");
    });

    scene.addEventListener("arError", () => {
        setStatus("Camera error — please refresh.");
        startBtn.disabled = false;
        startBtn.textContent = "Start Camera";
    });

    // Stop camera button
    stopBtn.addEventListener("click", () => {
        const arSystem = scene.systems["mindar-image-system"];
        if (arSystem && arStarted) {
            arSystem.stop();
            arStarted = false;
        }
        joker.setAttribute("visible", "false");
        container.style.display = "none";
        overlay.style.display = "flex";
        startBtn.disabled = false;
        startBtn.textContent = "Start Camera";
        ui.style.display = "none";
    });

    // Model appears standing on card when found
    target0.addEventListener("targetFound", () => {
        joker.setAttribute("visible", "true");
        // Standing upright on the card
        joker.setAttribute("position", "0 0.15 0");
        joker.setAttribute("rotation", "0 0 0");
        setStatus("Joker found ✅", true);
    });

    target0.addEventListener("targetLost", () => {
        joker.setAttribute("visible", "false");
        setStatus("Point at the Joker card 🃏");
    });
});