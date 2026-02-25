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
        setTimeout(() => {
            joker.setAttribute("visible", "true");
            setStatus("Joker found ✅");
        }, 100);
    });

    target0.addEventListener("targetLost", () => {
        joker.setAttribute("visible", "false");
        setStatus("Target lost...");
    });

    const fixLayout = () => {
        window.dispatchEvent(new Event('resize'));

        const canvas = document.querySelector('.a-canvas');
        if (canvas) {
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
        }

        const overlay2 = document.querySelector('.mindar-ui-overlay');
        if (overlay2) {
            overlay2.style.position = 'fixed';
            overlay2.style.top = '0';
            overlay2.style.left = '0';
            overlay2.style.width = '100vw';
            overlay2.style.height = '100vh';
        }

        const video = document.querySelector('video');
        if (video) {
            video.style.position = 'fixed';
            video.style.top = '0';
            video.style.left = '0';
            video.style.width = '100vw';
            video.style.height = '100vh';
            video.style.objectFit = 'cover';
        }
    };

    async function startAR() {
        try {
            setStatus("Starting camera...");
            scene.setAttribute("visible", "true");

            await new Promise((resolve) => {
                if (scene.hasLoaded) {
                    resolve();
                } else {
                    scene.addEventListener("loaded", resolve, { once: true });
                }
            });

            const arSystem = scene.systems["mindar-image-system"];
            if (!arSystem) throw new Error("MindAR system not ready.");

            await arSystem.start();

            // Run immediately and keep retrying for slow devices
            fixLayout();
            setTimeout(fixLayout, 300);
            setTimeout(fixLayout, 800);
            setTimeout(fixLayout, 1500);

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
        setStatus("Ready. Tap \"Start AR\".");
    }

    startBtn.addEventListener("click", startAR);
    startBtn2.addEventListener("click", startAR);
    stopBtn.addEventListener("click", stopAR);
});