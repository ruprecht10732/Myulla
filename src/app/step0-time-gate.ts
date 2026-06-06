import { Component, OnInit, inject, signal, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlowService } from './flow.service';

@Component({
  selector: 'app-time-gate',
  template: `
    <div class="relative w-full h-full bg-emerald-950 flex flex-col items-center justify-center p-6 overflow-hidden">
      <!-- Subtle ambient luxury glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-emerald-950 to-emerald-950 pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      <!-- Minimalist elegant card -->
      <div class="z-10 relative w-full max-w-[400px] flex flex-col items-center justify-center p-8 sm:p-12 text-center text-emerald-100">
        
        <div class="relative mb-10 w-32 h-32 sm:w-40 sm:h-40 group">
            <div class="absolute inset-0 bg-gold/20 rounded-full blur-xl group-hover:bg-gold/30 transition-all duration-1000"></div>
            <img src="fromt.png" alt="Myulla" class="relative w-full h-full object-cover rounded-full border-[3px] border-emerald-800 shadow-2xl transition-transform duration-700 group-hover:scale-105" />
        </div>

        @if (!targetReached()) {
          <h1 class="font-sans text-emerald-300 mb-6 text-[10px] sm:text-xs tracking-[0.4em] uppercase font-semibold">Para ser aberto em breve</h1>
          
          <div class="font-serif text-4xl sm:text-5xl text-emerald-50 tracking-widest tabular-nums font-light drop-shadow-md mb-8">
            {{ countdownText() }}
          </div>

          <div class="w-12 h-[1px] bg-yellow-500/50 mb-8"></div>

          <p class="text-emerald-300 font-serif italic text-sm sm:text-base">
             Aguarde com carinho...
          </p>
          
          <div class="absolute bottom-[-40px] left-0 w-full flex justify-center opacity-0 focus-within:opacity-100 hover:opacity-10 transition-opacity duration-500">
            <button (click)="bypass()" class="px-4 py-2 text-[10px] text-emerald-300 tracking-widest uppercase">Bypass</button>
          </div>
        } @else {
          <h1 class="font-serif text-yellow-400 text-3xl sm:text-4xl font-light mb-4 leading-tight tracking-[0.05em] drop-shadow-md">Bem-vinda, Meu Amor</h1>
          <p class="text-emerald-200 font-serif mb-16 italic text-sm sm:text-base">Chegou a hora de descobrir o seu presente.</p>
          
          <button (click)="onStart()" 
            class="group relative px-12 py-5 bg-white/5 hover:bg-white/10 rounded-full text-emerald-100 border border-white/10 backdrop-blur-sm font-sans text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 outline-none overflow-hidden">
            <span class="relative z-10 transition-colors duration-300 group-hover:text-white">ABRIR ENVELOPE</span>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></div>
          </button>
        }
      </div>
    </div>
  `
})
export class TimeGateComponent implements OnInit, OnDestroy {
  flow = inject(FlowService);
  
  targetDate = new Date('2026-06-07T03:00:00Z').getTime(); // Teresina 00:00 is 03:00 UTC
  countdownText = signal('00d : 00h : 00m : 00s');
  targetReached = signal(false);
  intervalId: ReturnType<typeof setInterval> | undefined;
  platformId = inject(PLATFORM_ID);

  async ngOnInit() {
    this.updateCountdown();
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => this.updateCountdown(), 1000);
      try {
        const res = await fetch('/api/config');
        const config = await res.json();
        if (config.bypassTimeGate) {
          this.targetReached.set(true);
          this.countdownText.set('00d : 00h : 00m : 00s');
          if (this.intervalId) clearInterval(this.intervalId);
        }
      } catch (e) {
        console.warn("Could not load config", e);
      }
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance < 0) {
      this.targetReached.set(true);
      this.countdownText.set('00d : 00h : 00m : 00s');
      clearInterval(this.intervalId);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.countdownText.set(
      `${days.toString().padStart(2, '0')}d : ${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`
    );
  }

  onStart() {
    this.flow.playMusic();
    this.flow.next();
  }

  bypass() {
    this.flow.playMusic();
    this.flow.next();
  }
}
