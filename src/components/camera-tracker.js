// src/components/camera-tracker.js
// Client-side camera management & MediaPipe landmark overlay renderer

export class CameraTracker {
  constructor(videoElement, canvasElement, onStatusUpdate) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.onStatusUpdate = onStatusUpdate || (() => {});

    this.stream = null;
    this.handsDetector = null;
    this.mpCamera = null;
    this.isRunning = false;
    this.isSimulating = false;
    this.animFrameId = null;

    // Connections between the 21 MediaPipe hand landmarks
    this.HAND_CONNECTIONS = [
      [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8],       // Index
      [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
      [9, 13], [13, 14], [14, 15], [15, 16],// Ring
      [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
      [0, 17]                               // Palm base
    ];
  }

  async start() {
    this.isRunning = true;
    this.onStatusUpdate("INITIALIZING CAMERA...");

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        },
        audio: false
      });

      this.video.srcObject = this.stream;
      await this.video.play();
      this.resizeCanvas();
      window.addEventListener("resize", this.handleResize);

      // Attempt to load MediaPipe Hands
      await this.initMediaPipe();
    } catch (err) {
      console.warn("Real camera access unavailable or denied. Starting interactive landmark simulator.", err);
      this.startSimulation();
    }
  }

  handleResize = () => {
    this.resizeCanvas();
  };

  resizeCanvas() {
    if (!this.canvas || !this.video) return;
    const rect = this.video.getBoundingClientRect();
    this.canvas.width = rect.width || 640;
    this.canvas.height = rect.height || 480;
  }

  async initMediaPipe() {
    // Check if MediaPipe Hands is loaded globally
    if (window.Hands) {
      try {
        this.handsDetector = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        this.handsDetector.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        this.handsDetector.onResults(this.onResults);

        if (window.Camera) {
          this.mpCamera = new window.Camera(this.video, {
            onFrame: async () => {
              if (this.isRunning && this.handsDetector) {
                await this.handsDetector.send({ image: this.video });
              }
            },
            width: 640,
            height: 480
          });
          await this.mpCamera.start();
          this.onStatusUpdate("CAMERA READY · TRACKING HANDS");
          return;
        }
      } catch (mpErr) {
        console.warn("MediaPipe runtime error; falling back to canvas frame loop", mpErr);
      }
    }

    // Direct animation frame loop if CDN wrapper wasn't available
    this.runManualFrameLoop();
  }

  runManualFrameLoop() {
    const loop = () => {
      if (!this.isRunning) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
    this.onStatusUpdate("CAMERA READY");
  }

  onResults = (results) => {
    if (!this.isRunning) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const landmarksList = results.multiHandLandmarks;

    if (!landmarksList || landmarksList.length === 0) {
      this.onStatusUpdate("POSITION HANDS IN FRAME");
      return;
    }

    if (landmarksList.length === 1) {
      this.onStatusUpdate("1 HAND DETECTED");
    } else {
      this.onStatusUpdate("BOTH HANDS VISIBLE");
    }

    for (const landmarks of landmarksList) {
      this.drawHand(landmarks);
    }
  };

  drawHand(landmarks) {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Draw skeletal connector bones
    this.ctx.strokeStyle = "#3BE8B0";
    this.ctx.lineWidth = 3.0;
    this.ctx.lineCap = "round";

    for (const [startIdx, endIdx] of this.HAND_CONNECTIONS) {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];
      if (p1 && p2) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x * width, p1.y * height);
        this.ctx.lineTo(p2.x * width, p2.y * height);
        this.ctx.stroke();
      }
    }

    // Draw landmark joint dots
    for (const lm of landmarks) {
      const cx = lm.x * width;
      const cy = lm.y * height;

      this.ctx.beginPath();
      this.ctx.arc(cx, cy, 4.5, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.fill();
      this.ctx.lineWidth = 2.0;
      this.ctx.strokeStyle = "#0E9C6A";
      this.ctx.stroke();
    }
  }

  // Interactive landmark simulation for environments without webcams
  startSimulation() {
    this.isSimulating = true;
    this.onStatusUpdate("SIMULATOR ACTIVE · HANDS VISIBLE");
    let t = 0;

    const simLoop = () => {
      if (!this.isRunning) return;
      this.resizeCanvas();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      t += 0.04;
      const w = this.canvas.width;
      const h = this.canvas.height;

      // Generate realistic natural breathing hand landmarks
      const baseHand = this.generateSimulatedHand(w * 0.42 + Math.sin(t) * 12, h * 0.52 + Math.cos(t * 0.8) * 8, 1);
      const domHand = this.generateSimulatedHand(w * 0.58 + Math.cos(t) * 15, h * 0.48 + Math.sin(t * 1.1) * 10, 0.95);

      this.drawHand(baseHand);
      this.drawHand(domHand);

      this.animFrameId = requestAnimationFrame(simLoop);
    };

    this.animFrameId = requestAnimationFrame(simLoop);
  }

  generateSimulatedHand(rootX, rootY, scale) {
    const lms = [];
    const w = this.canvas.width;
    const h = this.canvas.height;
    const s = 55 * scale;

    const coords = [
      [0, 40], [-18, 28], [-28, 14], [-34, -2], [-38, -18], // Thumb
      [-14, 0], [-16, -24], [-17, -42], [-18, -58],          // Index
      [0, -2], [0, -28], [0, -48], [0, -64],                 // Middle
      [14, 0], [15, -24], [16, -42], [17, -56],              // Ring
      [26, 6], [28, -14], [29, -28], [30, -42]               // Pinky
    ];

    for (const [dx, dy] of coords) {
      lms.push({
        x: (rootX + dx * (s / 50)) / w,
        y: (rootY + dy * (s / 50)) / h
      });
    }
    return lms;
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener("resize", this.handleResize);

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.mpCamera) {
      try { this.mpCamera.stop(); } catch (e) {}
      this.mpCamera = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
