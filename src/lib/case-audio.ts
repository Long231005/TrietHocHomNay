import { Howl, Howler } from 'howler';

const names = ['csgo_ui_crate_open', 'csgo_ui_crate_item_scroll', 'item_reveal3_rare', 'item_reveal4_mythical', 'item_reveal5_legendary', 'item_reveal6_ancient'] as const;
export type CaseSound = typeof names[number];

export class CaseAudio {
  private sounds = new Map<CaseSound, Howl>();
  private muted = false;
  private disposed = false;
  private unlocked = false;
  private base: string;

  constructor(base: string) {
    this.base = base.endsWith('/') ? base : base + '/';
  }

  preload() {
    for (const name of names) {
      this.sounds.set(name, new Howl({
        src: [`${this.base}sounds/${name}.mp3`],
        volume: 0.65,
        preload: true,
      }));
    }
  }

  recover() {
    if (this.unlocked && !this.muted) this.unlock();
  }

  unlock() {
    if (this.disposed || this.muted) return;
    this.unlocked = true;
    Howler.ctx?.resume();
  }

  play(name: CaseSound) {
    if (this.disposed || this.muted || !this.unlocked) return;
    const sound = this.sounds.get(name);
    if (sound) {
      sound.play();
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    Howler.volume(muted ? 0 : 0.65);
    if (muted) {
      Howler.stop();
    } else {
      this.unlock();
    }
  }

  pause() {
    Howler.stop();
  }

  dispose() {
    this.disposed = true;
    this.sounds.forEach(s => s.unload());
    this.sounds.clear();
  }
}
