document.addEventListener("DOMContentLoaded", () => {
    const scene = document.getElementById("scene");
    const joker = document.getElementById("joker");
    const target0 = document.getElementById("target0");
    const statusEl = document.getElementById("status");
    const ui = document.getElementById("ui");

    const setStatus = (m) => {
        statusEl.textContent = m;
        console.log("[AR]", m);
    };

    scene.addEventListener("arReady", () => {
        ui.style.display = "flex";
        setStatus("Point at the Joker card 🃏");
    });

    scene.addEventListener("arError", () => {
        setStatus("Camera error — please refresh.");
    });

    target0.addEventListener("targetFound", () => {
        console.log("TARGET FOUND");
        joker.setAttribute("visible", "true");
        setStatus("Joker found ✅");
    });

    target0.addEventListener("targetLost", () => {
        joker.setAttribute("visible", "false");
        setStatus("Point at the Joker card 🃏");
    });
});