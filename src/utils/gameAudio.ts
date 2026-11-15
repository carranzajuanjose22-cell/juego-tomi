/** Synthesized locally: no assets, downloads or autoplay. */
export class GameAudio {
 private context: AudioContext | null = null;
 enabled = true;
 unlock() {
  try { this.context ??= new AudioContext(); void this.context.resume().catch(() => {}); } catch { /* Audio is optional. */ }
 }
 play(scored: boolean) {
  if (!this.enabled || !this.context || this.context.state !== 'running') return;
  const ctx = this.context;
  (scored ? [392, 523.25, 783.99] : [146.83]).forEach((frequency,i) => {
   const osc = ctx.createOscillator(), gain = ctx.createGain();
   const start = ctx.currentTime + i * .09;
   osc.type = scored ? 'sine' : 'triangle'; osc.frequency.setValueAtTime(frequency,start);
   gain.gain.setValueAtTime(0,start); gain.gain.linearRampToValueAtTime(.09,start+.015);
   gain.gain.exponentialRampToValueAtTime(.001,start+.32);
   osc.connect(gain); gain.connect(ctx.destination); osc.start(start); osc.stop(start+.34);
   osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  });
 }
 close() { void this.context?.close().catch(() => {}); this.context = null; }
}
