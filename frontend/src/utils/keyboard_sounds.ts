/**
 * Utilitário para gerar e tocar sons de feedback do teclado virtual
 */

class KeyboardSoundManager {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Inicializa AudioContext de forma lazy
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Toca som de tecla pressionada (clique suave)
   */
  playKeyPress() {
    if (this.isMuted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Som curto e suave
    oscillator.frequency.value = 800; // Frequência em Hz
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.05
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  /**
   * Toca som de acerto (positivo)
   */
  playCorrect() {
    if (this.isMuted || !this.audioContext) return;

    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Acorde positivo
    oscillator1.frequency.value = 523.25; // C5
    oscillator2.frequency.value = 659.25; // E5
    oscillator1.type = 'sine';
    oscillator2.type = 'sine';

    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.2
    );

    oscillator1.start(this.audioContext.currentTime);
    oscillator2.start(this.audioContext.currentTime);
    oscillator1.stop(this.audioContext.currentTime + 0.2);
    oscillator2.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Toca som de erro (negativo)
   */
  playWrong() {
    if (this.isMuted || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Som grave e dissonante
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      100,
      this.audioContext.currentTime + 0.15
    );
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.15
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  /**
   * Toca som de vitória
   */
  playVictory() {
    if (this.isMuted || !this.audioContext) return;

    // Sequência de notas ascendentes
    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    const duration = 0.15;

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = this.audioContext!.currentTime + index * duration;
      gainNode.gain.setValueAtTime(0.12, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  /**
   * Toca som de derrota
   */
  playDefeat() {
    if (this.isMuted || !this.audioContext) return;

    // Sequência de notas descendentes
    const notes = [329.63, 293.66, 261.63, 220.0]; // E4, D4, C4, A3
    const duration = 0.2;

    notes.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';

      const startTime = this.audioContext!.currentTime + index * duration;
      gainNode.gain.setValueAtTime(0.1, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  /**
   * Alterna mute dos sons
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Define estado de mute
   */
  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  /**
   * Retorna se está mutado
   */
  isSoundMuted() {
    return this.isMuted;
  }
}

// Singleton para gerenciar sons
export const keyboardSounds = new KeyboardSoundManager();
