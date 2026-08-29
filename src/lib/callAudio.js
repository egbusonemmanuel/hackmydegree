// src/lib/callAudio.js
// WhatsApp-style Ringtone & Calling Audio Synthesizer using Web Audio API

class WhatsAppAudioController {
    constructor() {
        this.audioCtx = null;
        this.isPlaying = false;
        this.intervalId = null;
        this.activeNodes = [];
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    // Exact WhatsApp Outgoing Calling Ring Tone
    playRingBurst() {
        if (!this.audioCtx || !this.isPlaying) return;
        const now = this.audioCtx.currentTime;

        const playTone = (freq1, freq2, startTime, duration) => {
            const osc1 = this.audioCtx.createOscillator();
            const osc2 = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc1.type = 'sine';
            osc2.type = 'sine';
            osc1.frequency.setValueAtTime(freq1, startTime);
            osc2.frequency.setValueAtTime(freq2, startTime);

            // Smooth WhatsApp-style bell envelope
            gain.gain.setValueAtTime(0.001, startTime);
            gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.05);
            gain.gain.setValueAtTime(0.16, startTime + duration - 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + duration);
            osc2.stop(startTime + duration);

            this.activeNodes.push(osc1, osc2, gain);
        };

        // WhatsApp Outgoing Double-Ring Sequence (Tone 1 -> short pause -> Tone 2)
        playTone(425, 450, now, 0.45);
        playTone(425, 450, now + 0.6, 0.45);
    }

    startRing() {
        this.init();
        this.stopRing();
        this.isPlaying = true;
        this.playRingBurst();
        this.intervalId = setInterval(() => {
            if (this.isPlaying) {
                this.playRingBurst();
            }
        }, 2800);
    }

    stopRing() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.activeNodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch (e) {
                // ignore
            }
        });
        this.activeNodes = [];
    }

    // WhatsApp Call Ended Disconnect Sound
    playEndTone() {
        this.init();
        this.stopRing();
        const now = this.audioCtx.currentTime;

        const tones = [
            { f: 480, t: now, d: 0.12 },
            { f: 420, t: now + 0.14, d: 0.12 },
            { f: 360, t: now + 0.28, d: 0.22 }
        ];

        tones.forEach(({ f, t, d }) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + d);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(t);
            osc.stop(t + d);
        });
    }
}

export const whatsAppAudio = new WhatsAppAudioController();
