import { Component, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FlowService } from './flow.service';
import { animate, stagger } from 'motion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-spotlight',
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="relative w-full h-full bg-emerald-950 overflow-hidden flex flex-col justify-end">
      <!-- Particle effects -->
      <div class="absolute inset-0 z-10 pointer-events-none">
         @for(particle of particles; track $index) {
            <div class="absolute w-1 h-1 bg-gold rounded-full opacity-0 particle-circle"
                 [style.left]="particle.x + '%'"
                 [style.top]="particle.y + '%'"
                 [style.transform]="'scale(' + particle.scale + ')'"
                 ></div>
         }
      </div>

    <!-- Main Image with Ken Burns -->
    <div class="absolute inset-0 z-0 bg-emerald-950" (click)="onNext()">
      <!-- Show uploaded image or a placeholder -->
      <img *ngIf="customImage"
        [src]="customImage" 
        (error)="customImage = null"
        alt="Spotlight"
        id="spotlight-image"
        class="w-full h-full object-contain object-top transform-gpu will-change-transform opacity-95 mix-blend-lighten"
      />
      
      <!-- Placeholder if no image is uploaded -->
      <div *ngIf="!customImage" id="spotlight-image" class="w-full h-full flex flex-col items-center justify-center bg-emerald-900 opacity-80">
         <mat-icon class="text-gold/20 w-24 h-24 mb-4" style="font-size: 96px; width: 96px; height: 96px;">volunteer_activism</mat-icon>
         <p class="text-emerald-300 font-serif tracking-widest uppercase text-xs">Upload her photo</p>
      </div>
    </div><!-- End main image -->

    <!-- Prominent Photo Picker (Hidden once uploaded) -->
    <div class="absolute inset-0 z-50 flex items-center justify-center pointer-events-none" *ngIf="!customImage">
       <input type="file" #fileInput (change)="onImageUpload($event)" class="hidden" accept="image/*" />
       <button (click)="fileInput.click()" class="pointer-events-auto flex items-center gap-3 bg-white/5 hover:bg-white/10 text-emerald-100 rounded-full px-8 py-4 backdrop-blur-md transition-all shadow-[0_0_40px_rgba(255,192,0,0.1)] border border-white/10">
          <mat-icon class="text-gold">photo_camera</mat-icon>
          <span class="font-sans tracking-widest uppercase text-xs font-bold">Adicionar Foto</span>
       </button>
    </div>
    
    <!-- Small Photo Picker (Always visible in corner to change later) -->
    <div class="absolute top-8 right-8 z-50 pointer-events-auto" *ngIf="customImage">
       <input type="file" #fileInputSmall (change)="onImageUpload($event)" class="hidden" accept="image/*" />
       <button (click)="fileInputSmall.click()" class="bg-black/50 hover:bg-black/80 text-emerald-200 hover:text-gold rounded-full p-3 backdrop-blur-md transition-all shadow-lg border border-white/5">
          <mat-icon>edit</mat-icon>
       </button>
    </div>

    <!-- Gradient Overlay & Text -->
    <div class="relative z-20 w-full bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent pt-40 pb-16 px-8 md:px-24 pointer-events-none">
      <div class="max-w-4xl mx-auto flex flex-col items-center text-center">
        <p id="spotlight-text-1" class="font-serif text-2xl md:text-3xl text-emerald-100 leading-tight mb-4 opacity-0 drop-shadow-2xl font-light">
          A mulher mais deslumbrante que já existiu, inigualável.
        </p>
        <div class="w-12 h-[1px] bg-gold/50 my-2 opacity-0" id="spotlight-divider"></div>
        <p id="spotlight-text-2" class="font-serif text-3xl md:text-5xl text-yellow-400 leading-tight mb-4 opacity-0 drop-shadow-2xl font-medium tracking-wide">
          A brilhante aniversariante,<br/>Myulla Christian.
        </p>
        <p id="spotlight-text-3" class="font-sans text-xs md:text-sm tracking-widest uppercase text-emerald-300 opacity-0 leading-relaxed max-w-2xl mt-4">
          Um nome de pura elegância, refletindo perfeitamente a beleza da sua alma.
        </p>
        
        <div id="spotlight-hint" class="mt-12 font-sans text-[10px] tracking-[0.3em] uppercase text-emerald-400 opacity-0 flex items-center gap-2">
          Toque para continuar <mat-icon class="text-xs w-3 h-3">chevron_right</mat-icon>
        </div>
      </div>
    </div>
    </div>
  `
})
export class SpotlightComponent implements AfterViewInit {
  flow = inject(FlowService);
  platformId = inject(PLATFORM_ID);
  
  fallbackImage = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1920&q=80";
  customImage: string | null = 'myulla.jpg'; 

  particles = Array.from({length: 40}).map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 1.5 + 0.5
  }));

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const saved = localStorage.getItem('myulla_spotlight_img');
    if (saved) {
      this.customImage = saved;
    }

    animate("#spotlight-image", 
      { scale: [1, 1.05] }, 
      { duration: 15, ease: 'linear' }
    );

    animate("#spotlight-text-1", 
      { opacity: [0, 1], y: [20, 0] }, 
      { duration: 2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }
    );
    animate("#spotlight-divider", 
      { opacity: [0, 1] }, 
      { duration: 2, delay: 2.5, ease: [0.22, 1, 0.36, 1] }
    );
    animate("#spotlight-text-2", 
      { opacity: [0, 1], y: [20, 0] }, 
      { duration: 2, delay: 3.5, ease: [0.22, 1, 0.36, 1] }
    );
    animate("#spotlight-text-3", 
      { opacity: [0, 1], y: [20, 0] }, 
      { duration: 2, delay: 5.5, ease: [0.22, 1, 0.36, 1] }
    );
    animate("#spotlight-hint",
      { opacity: [0, 1] },
      { duration: 2, delay: 8 }
    );

    const particleNodes = document.querySelectorAll('.particle-circle');
    if (particleNodes.length) {
      animate(particleNodes,
        { opacity: [0, 0.3, 0] },
        { 
          duration: 4, 
          delay: stagger(0.2, { startDelay: 1 }), 
          repeat: Infinity,
          ease: 'easeInOut'
        }
      );
    }
  }

  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.customImage = e.target.result;
        try {
           localStorage.setItem('myulla_spotlight_img', this.customImage as string);
        } catch (e) {
           console.warn('Image too large for localStorage, it will only be kept in memory for this session.', e);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onNext() {
    this.flow.next();
  }
}
