import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowService } from './flow.service';

interface FloatingItem {
  type: 'balloon' | 'heart';
  left: string;
  duration: string;
  swayDuration: string;
  delay: string;
  scale: string;
  maxOpacity: string;
  color: string;
}

@Component({
  selector: 'app-typewriter',
  imports: [CommonModule],
  styles: [`
    @keyframes floatUp {
      0% {
        transform: translateY(110vh) scale(var(--scale));
        opacity: 0;
      }
      10% {
        opacity: var(--max-opacity);
      }
      90% {
        opacity: var(--max-opacity);
      }
      100% {
        transform: translateY(-25vh) scale(var(--scale));
        opacity: 0;
      }
    }
    @keyframes sway {
      0%, 100% { transform: translateX(-15px); }
      50% { transform: translateX(15px); }
    }
    .floating-item {
      position: absolute;
      bottom: -15vh;
      will-change: transform, opacity;
      animation: floatUp var(--duration) linear infinite, sway var(--sway-duration) ease-in-out infinite alternate;
      animation-delay: var(--delay);
      left: var(--left);
    }
  `],
  template: `
    <div class="w-full h-full bg-emerald-950 flex flex-col items-center justify-center relative overflow-hidden px-6 sm:px-12 py-16">
      
      <!-- Subtle ambient luxury glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-emerald-950 to-emerald-950 pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      
      <!-- Floating Items -->
      <div class="absolute inset-0 z-0 pointer-events-none">
         @for (item of items; track $index) {
            <div class="floating-item flex justify-center items-center"
                 [style.--left]="item.left"
                 [style.--duration]="item.duration"
                 [style.--sway-duration]="item.swayDuration"
                 [style.--delay]="item.delay"
                 [style.--scale]="item.scale"
                 [style.--max-opacity]="item.maxOpacity"
                 [style.color]="item.color">
                 
                 @if (item.type === 'heart') {
                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 drop-shadow-lg">
                       <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                 } @else {
                    <svg viewBox="0 0 512 512" fill="currentColor" class="w-10 h-14 drop-shadow-lg opacity-90">
                      <path d="M256,16C185.349,16,128,73.349,128,144c0,95.539,95.962,174.577,109.11,185.252C242.428,333.568,249.034,336,256,336 s13.572-2.432,18.89-6.748C288.038,318.577,384,239.539,384,144C384,73.349,326.651,16,256,16z"/>
                      <polygon points="256,336 240,368 272,368 "/>
                      <path d="M256,350 v100" stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.5"/>
                    </svg>
                 }
            </div>
         }
      </div>

      <div class="max-w-3xl w-full flex-grow flex flex-col justify-center relative z-10 font-serif text-base sm:text-xl md:text-2xl leading-[1.6] md:leading-[1.8] text-emerald-50 tracking-wide font-light p-2 sm:p-8 border-l border-white/5 overflow-y-auto pb-32 cursor-pointer"
           (click)="skipTyping()">
        
        <p class="whitespace-pre-wrap drop-shadow-md mb-24">
          {{ displayedText() }}<span class="inline-block w-1.5 md:w-2 bg-gold ml-1 h-[1.1em] align-middle opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(255,192,0,0.5)]" [class.animate-pulse]="!isFinished()" [class.opacity-0]="isFinished()">&nbsp;</span>
        </p>
      </div>

      <div class="absolute bottom-0 left-0 w-full pt-24 pb-8 sm:pb-12 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent flex justify-center items-end z-20 transition-all duration-1000 delay-500 pointer-events-none"
           [class.opacity-0]="!isFinished()"
           [class.translate-y-8]="!isFinished()"
           [class.opacity-100]="isFinished()"
           [class.translate-y-0]="isFinished()">
        
        <button (click)="onNext()"
            class="pointer-events-auto group relative px-10 sm:px-14 py-4 md:py-5 bg-white/5 hover:bg-white/10 rounded-full text-emerald-100 border border-white/10 backdrop-blur-sm font-sans text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 outline-none overflow-hidden">
            <span class="relative z-10 transition-colors duration-300 group-hover:text-white">CONTINUAR</span>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></div>
        </button>
      </div>
    </div>
  `
})
export class TypewriterComponent implements OnInit {
  flow = inject(FlowService);
  displayedText = signal('');
  isFinished = signal(false);

  items: FloatingItem[] = Array.from({length: 15}).map(() => ({
    type: Math.random() > 0.5 ? 'balloon' : 'heart',
    left: Math.random() * 100 + '%',
    duration: (Math.random() * 15 + 10) + 's',
    swayDuration: (Math.random() * 3 + 2) + 's',
    delay: (Math.random() * -10) + 's',
    scale: (Math.random() * 0.5 + 0.6).toString(),
    maxOpacity: (Math.random() * 0.2 + 0.1).toString(),
    color: ['#FFC000', '#F43F5E', '#ec4899', '#facc15'][Math.floor(Math.random() * 4)] // Gold, Rose, Pink, Yellow
  }));
  
  fullText = "Meu amor,\n\nTodos os momentos maravilhosos que vivemos juntos evidenciam a sorte imensa que tenho. Você é, sem dúvidas, a mulher mais incrível deste mundo.\n\nEu sou infinitamente grato por você ter cruzado o meu caminho e por, desde então, iluminar e tornar cada um dos meus dias muito mais felizes.\n\nMesmo com a quilometragem e o oceano entre nós hoje, saiba que o meu coração e os meus pensamentos estão coladinhos com você.\n\nEu te amo com todas as minhas forças. Desejo que o seu dia seja repleto de sorrisos e alegria.";
  
  private abortTyping = false;

  ngOnInit() {
    this.type();
  }

  skipTyping() {
    if (this.isFinished()) return;
    this.abortTyping = true;
    this.displayedText.set(this.fullText);
    this.isFinished.set(true);
  }

  async type() {
    let current = '';
    const chars = this.fullText.split('');
    
    // Add brief initial pause for dramatic effect
    await new Promise(r => setTimeout(r, 800));

    for (let char of chars) {
      if (this.abortTyping) break;

      current += char;
      this.displayedText.set(current);
      
      let delay = 35;
      if (['.', ',', '!', '?'].includes(char)) {
        delay = 200;
      } else if (char === '\n') {
        delay = 300;
      }
      
      delay += Math.random() * 20 - 10; // humanize
      
      await new Promise(r => setTimeout(r, delay));
    }
    
    if (!this.abortTyping) {
        setTimeout(() => {
            if (!this.abortTyping) this.isFinished.set(true);
        }, 1500);
    }
  }

  onNext() {
    this.flow.next();
  }
}
