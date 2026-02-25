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
  console.log("[AR Status]:", m); 
};

// --- Tracking Events ---
target0.addEventListener("targetFound", () => {
  joker.setAttribute("visible", "true");
  setStatus("Joker found ✅ Keep steady.");
});

target0.addEventListener("targetLost", () => {
  joker.setAttribute("visible", "false");
  setStatus("Target lost… move closer.");
});

// --- AR Logic ---
// Add this helper function inside your script.js
function fixResize() {
  window.dispatchEvent(new Event('resize'));
}

async function startAR() {
  try {
    setStatus("Initializing camera...");
    scene.setAttribute("visible", "true");
    
    const arSystem = scene.systems["mindar-image-system"];
    if (!arSystem) throw new Error("AR System not found.");

    await arSystem.start(); 

    // Force a resize calculation after a short delay 
    // to ensure the video and canvas match the mobile screen
    setTimeout(fixResize, 300);

    overlay.style.display = "none";
    startBtn.style.display = "none";
    stopBtn.style.display = "inline-block";
    setStatus("Point camera at the Joker card.");
  } catch (e) {
    console.error(e);
    setStatus("AR failed: " + e.message);
    resetButtons();
  }
}

async function stopAR() {
  try {
    setStatus("Stopping AR...");
    const arSystem = scene.systems["mindar-image-system"];
    if (arSystem) await arSystem.stop();

    joker.setAttribute("visible", "false");
    scene.setAttribute("visible", "false");

    overlay.style.display = "flex";
    startBtn.style.display = "inline-block";
    stopBtn.style.display = "none";
    resetButtons();
    setStatus("Ready. Tap “Start AR”.");
  } catch (e) {
    setStatus("Stop failed: " + e.message);
  }
}

function resetButtons() {
  startBtn.disabled = false;
  startBtn2.disabled = false;
  startBtn.textContent = "Start AR";
}

// --- Listeners ---
startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  startBtn.textContent = "Loading...";
  startAR();
});

startBtn2.addEventListener("click", () => {
  startBtn2.disabled = true;
  startBtn.textContent = "Loading...";
  startAR();
});

stopBtn.addEventListener("click", stopAR);

document.addEventListener("visibilitychange", () => {
  if (document.hidden && stopBtn.style.display !== "none") {
    stopAR();
  }
});