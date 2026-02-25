document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);
    
    // Select all elements
    const scene = $("scene");
    const joker = $("joker");
    const target0 = $("target0");
    const statusEl = $("status");
    const overlay = $("overlay");
    const startBtn = $("startBtn");
    const startBtn2 = $("startBtn2");
    const stopBtn = $("stopBtn");

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
            scene.removeAttribute("background");
            
            const arSystem = scene.systems["mindar-image-system"];
            if (!arSystem) throw new Error("MindAR system not ready.");

            await arSystem.start(); 

            // Trigger resize to fix white padding
            [100, 500].forEach(delay => {
                setTimeout(() => window.dispatchEvent(new Event('resize')), delay);
            });

            overlay.style.display = "none";
            startBtn.style.display = "none";
            stopBtn.style.display = "inline-block";
            setStatus("Point at the Joker card.");
        } catch (e) {
            console.error(e);
            setStatus("AR Error: Check Camera Permissions");
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
        setStatus("Ready. Tap “Start AR”.");
    }

    // Attach Listeners
    startBtn.addEventListener("click", startAR);
    startBtn2.addEventListener("click", startAR);
    stopBtn.addEventListener("click", stopAR);
});