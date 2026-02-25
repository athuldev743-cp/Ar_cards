document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);
    const statusEl = $("status");
    const overlay = $("overlay");
    const startBtn = $("startBtn");
    const startBtn2 = $("startBtn2");
    const stopBtn = $("stopBtn");
    const scene = $("scene");
    const joker = $("joker");
    const target0 = $("target0");

    const setStatus = (m) => { 
        statusEl.textContent = m; 
        console.log("[AR]", m); 
    };

    // Tracking Events
    target0.addEventListener("targetFound", () => {
        joker.setAttribute("visible", "true");
        setStatus("Joker found ✅");
    });

    target0.addEventListener("targetLost", () => {
        joker.setAttribute("visible", "false");
        setStatus("Target lost...");
    });

    async function startAR() {
        try {
            setStatus("Starting camera...");
            scene.setAttribute("visible", "true");
            
            const arSystem = scene.systems["mindar-image-system"];
            await arSystem.start(); 

            // Fix camera resize glitch
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 500);

            overlay.style.display = "none";
            startBtn.style.display = "none";
            stopBtn.style.display = "inline-block";
            setStatus("Point at the Joker card.");
        } catch (e) {
            setStatus("AR Error: " + e.message);
            startBtn.disabled = false;
        }
    }

    async function stopAR() {
        const arSystem = scene.systems["mindar-image-system"];
        if (arSystem) await arSystem.stop();
        scene.setAttribute("visible", "false");
        overlay.style.display = "flex";
        startBtn.style.display = "inline-block";
        stopBtn.style.display = "none";
        startBtn.disabled = false;
        startBtn2.disabled = false;
    }

    startBtn.addEventListener("click", startAR);
    startBtn2.addEventListener("click", startAR);
    stopBtn.addEventListener("click", stopAR);
});