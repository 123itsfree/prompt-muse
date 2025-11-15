export class TTSService {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.loadVoices();

      if (this.synthesis) {
        this.synthesis.addEventListener('voiceschanged', () => {
          this.loadVoices();
        });
      }
    }
  }

  private loadVoices() {
    if (this.synthesis) {
      this.voices = this.synthesis.getVoices();
    }
  }

  private selectBestVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const preferredVoices = [
      'Google US English',
      'Microsoft Aria Online (Natural) - English (United States)',
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Samantha',
      'Alex',
      'Karen',
      'Daniel',
      'Fiona',
      'Moira',
      'Tessa',
      'Microsoft David',
      'Microsoft Zira',
      'Google UK English Female',
      'Google UK English Male',
    ];

    for (const preferredName of preferredVoices) {
      const voice = this.voices.find(v => v.name.includes(preferredName));
      if (voice) return voice;
    }

    const enVoices = this.voices.filter(v => v.lang.startsWith('en'));

    const femaleVoice = enVoices.find(v =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('jenny') ||
      v.name.toLowerCase().includes('aria')
    );

    if (femaleVoice) return femaleVoice;

    const naturalVoice = enVoices.find(v =>
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('enhanced') ||
      v.name.toLowerCase().includes('premium')
    );

    if (naturalVoice) return naturalVoice;

    return enVoices[0] || this.voices[0] || null;
  }

  speak(text: string, onEnd?: () => void): void {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    this.stop();

    this.currentUtterance = new SpeechSynthesisUtterance(text);

    const voice = this.selectBestVoice();
    if (voice) {
      this.currentUtterance.voice = voice;
    }

    this.currentUtterance.rate = 0.95;
    this.currentUtterance.pitch = 1.0;
    this.currentUtterance.volume = 1.0;

    this.currentUtterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.synthesis.speak(this.currentUtterance);
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  isPlaying(): boolean {
    return this.synthesis?.speaking || false;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

export const ttsService = new TTSService();
