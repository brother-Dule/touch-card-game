// Tajmer poteza: javlja preostali deo vremena (0..1) svaki frejm i poziva onTimeout.
export class TurnTimer {
  constructor({ onTick, onTimeout }) {
    this.onTick = onTick;
    this.onTimeout = onTimeout;
    this.raf = 0;
    this.end = 0;
    this.duration = 0;
    this.remaining = 0;
    this.running = false;
  }

  start(ms) {
    this.stop();
    this.duration = ms;
    this.end = performance.now() + ms;
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  pause() {
    if (!this.running) return;
    this.remaining = Math.max(0, this.end - performance.now());
    this.stop();
    this.paused = true;
  }

  resume() {
    if (!this.paused) return;
    this.paused = false;
    this.end = performance.now() + this.remaining;
    this.running = true;
    this.loop();
  }

  loop = () => {
    if (!this.running) return;
    const left = Math.max(0, this.end - performance.now());
    this.onTick(left / this.duration, left);
    if (left <= 0) {
      this.running = false;
      this.onTimeout();
      return;
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}
