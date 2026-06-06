import { Component, AfterViewInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlowService } from './flow.service';
import { animate } from 'motion';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stats',
  imports: [MatIconModule, DecimalPipe],
  template: `
    <div class="w-full h-full bg-emerald-950 flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-8 py-8 sm:py-16">
      
      <!-- Subtle ambient luxury glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-400/10 via-emerald-950 to-emerald-950 pointer-events-none"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <!-- Additional Floating Lights -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
      
      <div class="max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 relative z-10 p-2 mb-24 overflow-y-auto scrollbar-hide" style="max-height: 75vh;">
        
        <!-- Messages Stat -->
        <div class="flex flex-col items-center justify-center opacity-0 group bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-400/20 rounded-[2rem] p-5 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-700 hover:-translate-y-1 relative overflow-hidden" id="stat-messages">
          
          <div class="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div class="flex items-center gap-2 mb-3 text-yellow-400 transition-all duration-500 bg-yellow-400/10 border border-yellow-400/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.1)] relative z-10">
            <mat-icon class="text-lg sm:text-xl w-5 h-5 flex items-center justify-center">chat</mat-icon>
            <h3 class="font-sans font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs drop-shadow-md">Mensagens</h3>
          </div>
          
          <div class="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-center text-white mb-2 tabular-nums tracking-tighter drop-shadow-lg transition-transform duration-700 group-hover:scale-105 relative z-10">
            {{ messagesCount() | number:'1.0-0' }}
          </div>
          
          <div class="font-sans text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed text-center px-2 relative z-10">
            Muito <span class="text-yellow-400 font-bold">texto</span> trocado por nós dois.
          </div>
        </div>

        <!-- Typing Hours Stat -->
        <div class="flex flex-col items-center justify-center opacity-0 group bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-400/20 rounded-[2rem] p-5 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-700 hover:-translate-y-1 relative overflow-hidden" id="stat-typing">
          
          <div class="absolute inset-0 bg-gradient-to-bl from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div class="flex items-center gap-2 mb-3 text-emerald-400 transition-all duration-500 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.1)] relative z-10">
            <mat-icon class="text-lg sm:text-xl w-5 h-5 flex items-center justify-center">keyboard</mat-icon>
            <h3 class="font-sans font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs drop-shadow-md">Digitando</h3>
          </div>
          
          <div class="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-center text-white mb-2 tabular-nums tracking-tighter drop-shadow-lg flex items-baseline justify-center transition-transform duration-700 group-hover:scale-105 relative z-10">
            {{ typingHoursCount() | number:'1.0-0' }}<span class="text-3xl sm:text-4xl text-emerald-200 font-light ml-2 border-emerald-300/30">h</span>
          </div>
          
          <div class="font-sans text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed text-center px-2 relative z-10">
            Dedicadas a <span class="text-emerald-400 font-bold">escrever</span> nossos momentos.
          </div>
        </div>

        <!-- Video Calls Stat -->
        <div class="flex flex-col items-center justify-center opacity-0 group bg-emerald-900/40 hover:bg-emerald-800/60 border border-blue-400/20 rounded-[2rem] p-5 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-700 hover:-translate-y-1 relative overflow-hidden" id="stat-calls">
          
          <div class="absolute inset-0 bg-gradient-to-tr from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div class="flex items-center gap-2 mb-3 text-blue-400 transition-all duration-500 bg-blue-400/10 border border-blue-400/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.1)] relative z-10">
            <mat-icon class="text-lg sm:text-xl w-5 h-5 flex items-center justify-center">videocam</mat-icon>
            <h3 class="font-sans font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs drop-shadow-md">Chamadas</h3>
          </div>
          
          <div class="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-center text-white mb-2 tabular-nums tracking-tighter drop-shadow-lg transition-transform duration-700 group-hover:scale-105 relative z-10">
            {{ videoCallsCount() | number:'1.0-0' }}
          </div>
          
          <div class="font-sans text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed text-center px-2 relative z-10">
            Vezes que pudemos <span class="text-blue-400 font-bold">sorrir</span> um para o outro.
          </div>
        </div>
        
        <!-- Video Hours Stat -->
        <div class="flex flex-col items-center justify-center opacity-0 group bg-emerald-900/40 hover:bg-emerald-800/60 border border-purple-400/20 rounded-[2rem] p-5 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-700 hover:-translate-y-1 relative overflow-hidden" id="stat-video-hours">
          
          <div class="absolute inset-0 bg-gradient-to-tl from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div class="flex items-center gap-2 mb-3 text-purple-400 transition-all duration-500 bg-purple-400/10 border border-purple-400/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(167,139,250,0.1)] relative z-10">
            <mat-icon class="text-lg sm:text-xl w-5 h-5 flex items-center justify-center">access_time</mat-icon>
            <h3 class="font-sans font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs drop-shadow-md">Tempo em vídeo</h3>
          </div>
          
          <div class="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-center text-white mb-2 tabular-nums tracking-tighter drop-shadow-lg flex items-baseline justify-center transition-transform duration-700 group-hover:scale-105 relative z-10">
            {{ videoHoursCount() | number:'1.0-0' }}<span class="text-3xl sm:text-4xl text-purple-200 font-light ml-2 border-purple-300/30">h</span>
          </div>
          
          <div class="font-sans text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed text-center px-2 relative z-10">
            De pura e real <span class="text-purple-400 font-bold">sintonia</span> e conexão.
          </div>
        </div>

      </div>

      <div class="absolute bottom-6 lg:bottom-10 left-0 w-full flex justify-center z-[100] transition-opacity duration-1000" 
           [style.opacity]="buttonOpacity()" 
           [class.pointer-events-none]="buttonOpacity() === 0">
        <button (click)="onNext()"
                class="group relative flex items-center justify-center gap-4 px-12 py-5 bg-emerald-900 border border-emerald-700/50 hover:bg-emerald-800 hover:border-emerald-500/50 rounded-full text-white backdrop-blur-xl font-sans text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:-translate-y-1 cursor-pointer">
          <span class="relative z-10 font-bold drop-shadow-md">AVANÇAR AGORA</span>
          <mat-icon class="relative z-10 w-5 h-5 text-base transition-transform duration-300 group-hover:translate-x-2 flex items-center justify-center text-yellow-400">east</mat-icon>
        </button>
      </div>
    </div>
  `
})
export class StatsComponent implements AfterViewInit {
  flow = inject(FlowService);
  platformId = inject(PLATFORM_ID);
  
  messagesCount = signal(0);
  typingHoursCount = signal(0);
  videoCallsCount = signal(0);
  videoHoursCount = signal(0);

  TARGET_MESSAGES = 25314;
  TARGET_TYPING = 60;
  TARGET_CALLS = 75;
  TARGET_VIDEO_HOURS = 40;

  buttonOpacity = signal(0);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateEntrances();
    }
  }

  animateEntrances() {
    // Fade in blocks sequentially
    animate("#stat-messages", { opacity: [0, 1], y: [30, 0] }, { duration: 1.5, ease: "easeOut" });
    animate("#stat-typing", { opacity: [0, 1], y: [30, 0] }, { duration: 1.5, delay: 0.2, ease: "easeOut" });
    animate("#stat-calls", { opacity: [0, 1], y: [30, 0] }, { duration: 1.5, delay: 0.4, ease: "easeOut" });
    animate("#stat-video-hours", { opacity: [0, 1], y: [30, 0] }, { duration: 1.5, delay: 0.6, ease: "easeOut" });
    
    setTimeout(() => {
      this.buttonOpacity.set(1);
    }, 2800);

    // Numbers animation
    animate(0, this.TARGET_MESSAGES, {
      duration: 3,
      ease: "easeOut",
      onUpdate: (latest) => {
        this.messagesCount.set(Math.round(latest));
      }
    });

    animate(0, this.TARGET_TYPING, {
      duration: 3,
      delay: 0.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        this.typingHoursCount.set(Math.round(latest));
      }
    });
    
    animate(0, this.TARGET_CALLS, {
      duration: 3,
      delay: 0.4,
      ease: "easeOut",
      onUpdate: (latest) => {
        this.videoCallsCount.set(Math.round(latest));
      }
    });
    
    animate(0, this.TARGET_VIDEO_HOURS, {
      duration: 3,
      delay: 0.6,
      ease: "easeOut",
      onUpdate: (latest) => {
        this.videoHoursCount.set(Math.round(latest));
      }
    });
  }

  onNext() {
    this.flow.next();
  }
}
