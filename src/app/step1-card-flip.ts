import { Component, inject, signal } from '@angular/core';
import { FlowService } from './flow.service';

@Component({
  selector: 'app-card-flip',
  template: `
    <div class="relative w-full h-full bg-emerald-950 flex flex-col items-center justify-center p-8 overflow-hidden" style="perspective:1500px">
      <!-- Background subtle pulse -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/15 via-emerald-950 to-emerald-950 pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-15 pointer-events-none mix-blend-overlay"></div>

      <div class="mb-12 font-sans text-emerald-300/70 text-sm tracking-[0.3em] uppercase transition-opacity duration-1000" [class.opacity-0]="isFlipped()">
        Toque para abrir
      </div>

      <div 
        class="relative w-full max-w-md aspect-[3/4] md:aspect-[4/5] cursor-pointer transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-10"
        style="transform-style:preserve-3d"
        [style.transform]="isFlipped() ? 'rotateY(-180deg) scale(1.1)' : 'rotateY(0deg)'"
        tabindex="0"
        (keydown.enter)="flip()"
        (click)="flip()">
        
        <!-- Front -->
        <div class="absolute inset-0 bg-[#f8f6f0] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] flex items-center justify-center border-2 border-white/20 overflow-hidden" style="backface-visibility: hidden; -webkit-backface-visibility: hidden;">
          <!-- Subtle paper texture -->
          <div class="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply pointer-events-none"></div>
          
          <div class="relative flex flex-col items-center">
            <h2 class="font-serif text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-emerald-900 to-emerald-700 drop-shadow-sm p-4 tracking-tight font-light">Para Myulla</h2>
            <div class="w-16 h-[1px] bg-gold/50 mt-4"></div>
          </div>
          
          <!-- Wax seal styling -->
          <div class="absolute bottom-10 w-12 h-12 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center border border-emerald-700/50">
             <span class="text-yellow-500 text-lg font-serif italic drop-shadow-sm mr-0.5">M</span>
          </div>
        </div>

        <!-- Back -->
        <div class="absolute inset-0 bg-[#f8f6f0] rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] border border-white/20" style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg);">
            <div class="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply pointer-events-none"></div>
            <div class="w-full h-full flex flex-col items-center justify-center opacity-0 transition-opacity duration-1000 delay-[600ms]" [class.opacity-100]="isFlipped()">
                <div class="relative w-16 h-16 flex items-center justify-center animate-pulse">
                   <div class="absolute inset-0 border border-emerald-900/20 rounded-full animate-[spin_4s_linear_infinite]"></div>
                   <div class="absolute inset-2 border border-yellow-500/50 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                   <div class="w-2 h-2 bg-emerald-900 rounded-full"></div>
                </div>
                <div class="mt-8 font-serif italic text-emerald-900/60 tracking-widest text-sm">Abrindo o seu mundo...</div>
            </div>
        </div>
      </div>
    </div>
  `
})
export class CardFlipComponent {
  flow = inject(FlowService);
  isFlipped = signal(false);

  flip() {
    if (this.isFlipped()) return;
    this.isFlipped.set(true);
    
    setTimeout(() => {
        this.flow.next();
    }, 2200);
  }
}
