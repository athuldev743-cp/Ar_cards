document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);
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

  target0.addEventListener("targetFound", () => {
    // A tiny delay before showing can sometimes hide the initial 'snap' jitter
    setTimeout(() => {
        joker.setAttribute("visible", "true");
        setStatus("Joker found ✅");
    }, 100);
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
        if (!arSystem) throw new Error("MindAR system not ready.");

        await arSystem.start();

        // Wait for renderer to be ready then force transparent
        scene.addEventListener('renderstart', () => {
            scene.renderer.setClearColor(0x000000, 0);
            scene.renderer.alpha = true;
        }, { once: true });

        // Also set immediately in case renderstart already fired
        if (scene.renderer) {
            scene.renderer.setClearColor(0x000000, 0);
            scene.renderer.alpha = true;
        }

        const fixLayout = () => {
            window.dispatchEvent(new Event('resize'));
            const canvas = document.querySelector('.a-canvas');
            if (canvas) {
                canvas.style.width = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';
                canvas.style.background = 'transparent';
            }
        };

        fixLayout();
        setTimeout(fixLayout, 300);
        setTimeout(fixLayout, 1000);

        overlay.style.display = "none";
        startBtn.style.display = "none";
        stopBtn.style.display = "inline-block";
        setStatus("Point at the Joker card.");
    } catch (e) {
        console.error(e);
        setStatus("AR Error: Camera access required");
    }
}

    async function stopAR() {
        const arSystem = scene.systems["mindar-image-system"];
        if (arSystem) await arSystem.stop();
        
        scene.setAttribute("visible", "false");
        overlay.style.display = "flex";
        startBtn.style.display = "inline-block";
        stopBtn.style.display = "none";
        setStatus("Ready. Tap “Start AR”.");
    }

    startBtn.addEventListener("click", startAR);
    startBtn2.addEventListener("click", startAR);
    stopBtn.addEventListener("click", stopAR);
});