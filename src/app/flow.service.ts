import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export enum BirthdayStep {
  TimeGate = 0,
  CardFlip = 1,
  Typewriter = 2,
  Stats = 3,
  Spotlight = 4,
  MapFusion = 5,
  Selfie = 6,
  EmotionalIntro = 7,
  GiftReveal = 8
}

@Injectable({ providedIn: 'root' })
export class FlowService {
  public currentStep = signal<BirthdayStep>(BirthdayStep.TimeGate);
  private audio: HTMLAudioElement | null = null;
  private platformId = inject(PLATFORM_ID);
  
  constructor() {
    // Disabled recovering state to allow easy restart during development
  }

  public playMusic() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.audio) {
        this.audio = new Audio('audio.mp3');
        this.audio.loop = true;
      }
      this.audio.play().catch(e => console.warn('Audio play failed', e));
    }
  }

  public next(): void {
    const nextStep = this.currentStep() + 1;
    if (nextStep <= BirthdayStep.GiftReveal) {
      this.currentStep.set(nextStep);
    }
  }

  public reset(): void {
    this.currentStep.set(BirthdayStep.TimeGate);
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
}
