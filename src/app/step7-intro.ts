import { Component, OnInit, inject, signal } from '@angular/core';
import { FlowService } from './flow.service';

@Component({
  selector: 'app-emotional-intro',
  template: `
    <div class="relative w-full h-full bg-emerald-950 flex flex-col items-center justify-center text-center overflow-hidden px-6 sm:px-12 py-12">
        <!-- Subtle ambient luxury glow -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-emerald-950 to-emerald-950 pointer-events-none"></div>
        <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>

       <div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8 md:space-y-12">
          
          <p class="font-serif text-xl sm:text-2xl lg:text-3xl text-emerald-50 leading-[1.6] sm:leading-[1.8] font-light transition-all duration-[2500ms] ease-out"
             [class.opacity-0]="opacity() === 0"
             [class.translate-y-6]="opacity() === 0"
             [class.blur-sm]="opacity() === 0"
             [class.opacity-100]="opacity() > 0"
             [class.translate-y-0]="opacity() > 0"
             [class.blur-0]="opacity() > 0">
            Hoje celebramos a vida da mulher mais incrível do mundo.
          </p>

          <p class="font-serif text-lg sm:text-xl lg:text-2xl text-emerald-100 leading-[1.6] sm:leading-[1.8] font-light transition-all duration-[2500ms] ease-out"
             [class.opacity-0]="opacity() < 2"
             [class.translate-y-6]="opacity() < 2"
             [class.blur-sm]="opacity() < 2"
             [class.opacity-100]="opacity() >= 2"
             [class.translate-y-0]="opacity() >= 2"
             [class.blur-0]="opacity() >= 2">
             Eu tentei comprar os produtos de skincare que você gosta online, mas não encontrei uma forma de entregar com segurança...
          </p>
          
          <p class="font-serif text-base sm:text-lg md:text-xl text-emerald-200 italic leading-[1.6] sm:leading-[1.8] max-w-3xl font-light transition-all duration-[2500ms] ease-out"
             [class.opacity-0]="opacity() < 3"
             [class.translate-y-6]="opacity() < 3"
             [class.blur-sm]="opacity() < 3"
             [class.opacity-100]="opacity() >= 3"
             [class.translate-y-0]="opacity() >= 3"
             [class.blur-0]="opacity() >= 3">
             Então, depois de pesquisar um pouco, descobri essa outra possibilidade. Espero do fundo do coração que você aproveite e se cuide muito!
          </p>
          
          <div class="flex flex-col items-center pt-8 transition-all duration-1000 delay-500"
               [class.opacity-0]="opacity() < 4"
               [class.opacity-100]="opacity() >= 4">
               
            <p class="font-sans font-medium text-rose-300 tracking-[0.3em] uppercase text-xs sm:text-sm mb-12">
               Feliz Aniversário, Meu Amor.
            </p>

            <button (click)="onNext()"
                    class="group relative px-10 sm:px-14 py-4 sm:py-5 bg-white/5 hover:bg-white/10 rounded-full text-emerald-100 border border-white/10 backdrop-blur-sm font-sans text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 outline-none focus:ring-1 focus:ring-white/20 overflow-hidden">
                <span class="relative z-10 transition-colors duration-300 group-hover:text-white">ABRIR PRESENTE</span>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_2s_infinite]"></div>
            </button>
          </div>
       </div>

    </div>
  `
})
export class EmotionalIntroComponent implements OnInit {
  flow = inject(FlowService);
  opacity = signal(0);

  ngOnInit() {
    this.sequence();
  }

  async sequence() {
    await new Promise(r => setTimeout(r, 1200));
    this.opacity.set(1);
    
    await new Promise(r => setTimeout(r, 4500));
    this.opacity.set(2);
    
    await new Promise(r => setTimeout(r, 5000));
    this.opacity.set(3);
    
    await new Promise(r => setTimeout(r, 5500));
    this.opacity.set(4);
  }

  onNext() {
    this.flow.next();
  }
}
