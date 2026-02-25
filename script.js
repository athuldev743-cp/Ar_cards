document.addEventListener("DOMContentLoaded", () => {
    const scene = document.getElementById("scene");
    const joker = document.getElementById("joker");
    const target0 = document.getElementById("target0");
    const statusEl = document.getElementById("status");
    const overlay = document.getElementById("overlay");
    const ui = document.getElementById("ui");

    const setStatus = (m) => {
        statusEl.textContent = m;
        console.log("[AR]", m);
    };

    // Hide overlay and show UI once AR camera is live
    scene.addEventListener("arReady", () => {
        overlay.style.display = "none";
        ui.style.display = "flex";
        setStatus("Point at the Joker card.");
    });

    scene.addEventListener("arError", () => {
        setStatus("Camera error — please refresh.");
    });

    target0.addEventListener("targetFound", () => {
        joker.setAttribute("visible", "true");
        setStatus("Joker found ✅");
    });

    target0.addEventListener("targetLost", () => {
        joker.setAttribute("visible", "false");
        setStatus("Scanning...");
    });
});