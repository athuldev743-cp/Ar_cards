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
        
        const arSystem = scene.systems["mindar-image-system"];
        await arSystem.start(); 

        // Trigger multiple resizes to kill the white padding
        const resizer = () => window.dispatchEvent(new Event('resize'));
        resizer();
        setTimeout(resizer, 200);
        setTimeout(resizer, 1000);

        document.getElementById("overlay").style.display = "none";
        document.getElementById("startBtn").style.display = "none";
        document.getElementById("stopBtn").style.display = "inline-block";
    } catch (e) {
        console.error(e);
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