import { Component, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FlowService } from './flow.service';
import { animate } from 'motion';
import { interpolate } from 'flubber';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-map-fusion',
  imports: [MatIconModule],
  template: `
    <div class="relative w-full h-full bg-emerald-950 overflow-hidden flex flex-col items-center justify-center cursor-pointer px-6" (click)="onNext()">
      <!-- Subtle ambient luxury glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-emerald-950 to-emerald-950 pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div class="relative w-full max-w-4xl h-[50vh] min-h-[300px] flex items-center justify-center" id="map-container">
        
        <!-- Brazil Vector -->
        <div id="map-br" class="absolute w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 flex items-center justify-center opacity-0 drop-shadow-2xl" style="transform: translateX(-30vw) scale(1);">
          <svg viewBox="0 0 100 100" class="w-full h-full text-emerald-500 overflow-visible">
            <defs>
              <pattern id="br-flag" viewBox="0 0 100 100" patternUnits="userSpaceOnUse" width="100%" height="100%">
                <rect x="0" y="0" width="100" height="100" fill="#009c3b" />
                <polygon points="50,15 85,50 50,85 15,50" fill="#ffdf00" />
                <circle cx="50" cy="50" r="15" fill="#002776" />
              </pattern>
              <clipPath id="left-half">
                <rect x="0" y="0" width="50" height="100" />
              </clipPath>
            </defs>
            <path class="fill-path" d="M52.396,100L51.723,98.353L52.79,96.981L51.391,95.024L49.484,93.442L46.983,91.621L46.082,91.707L43.642,89.526L42.068,89.826L45.303,86.016L48.05,83.339L49.676,82.22L51.723,80.713L51.775,78.543L50.56,76.986L49.353,77.506L49.825,75.953L50.157,74.366L50.157,72.9L49.283,72.419L48.373,72.851L47.472,72.734L47.184,71.709L46.956,69.291L46.502,68.503L44.866,67.792L43.869,68.307L41.307,67.805L41.464,64.263L40.747,62.819L41.508,62.285L41.272,60.814L41.945,59.686L42.374,57.669L41.796,56.083L40.476,55.368L40.213,54.366L40.572,52.899L35.91,52.796L34.975,49.857L35.683,49.815L35.657,48.73L35.176,48L35.071,46.55L33.663,45.809L32.132,45.835L31.127,45.108L29.482,44.614L28.529,43.686L25.809,43.273L23.168,41.05L23.369,39.389L23.072,38.44L23.325,36.589L20.151,37.006L18.865,37.934L16.74,38.933L16.197,39.683L14.947,39.737L13.145,39.528L11.772,39.955L10.67,39.67L10.827,35.918L8.833,37.37L6.691,37.307L5.772,35.993L4.163,35.851L4.679,34.793L3.324,33.299L2.318,31.09L2.956,30.643L2.956,29.607L4.426,28.899L4.181,27.579L4.802,26.727L4.977,25.591L7.758,23.932L9.743,23.462L10.067,23.095L12.262,23.21L13.355,16.54L13.407,15.487L13.031,14.093L11.956,13.209L11.964,11.441L13.329,11.042L13.819,11.292L13.897,10.363L12.48,10.112L12.445,8.59L17.177,8.644L17.982,7.809L18.655,8.578L19.136,10.014L19.591,9.713L20.929,10.996L22.818,10.84L23.29,10.096L25.092,9.528L26.098,9.129L26.378,8.101L28.109,7.41L27.978,6.899L25.923,6.689L25.582,5.158L25.687,3.527L24.593,2.896L25.048,2.669L26.85,2.983L28.783,3.593L29.482,3.016L31.231,2.636L33.943,1.725L34.835,0.797L34.511,0.107L35.779,0L36.339,0.561L36.024,1.63L36.864,2.001L37.415,3.131L36.741,3.992L36.357,6.06L36.977,7.29L37.152,8.418L38.648,9.557L39.846,9.676L40.108,9.199L40.878,9.096L41.98,8.669L42.767,8.023L44.114,8.228L44.7,8.142L46.021,8.339L46.239,7.846L45.837,7.36L46.082,6.657L47.061,6.875L48.207,6.624L49.598,7.138L50.656,7.64L51.408,6.982L51.95,7.085L52.283,7.768L53.446,7.595L54.382,6.673L55.125,4.878L56.559,2.653L57.39,2.537L57.994,3.885L59.349,8.138L60.652,8.537L60.714,10.215L58.894,12.218L59.647,12.95L63.941,13.328L64.028,15.766L65.874,14.171L68.926,15.043L72.967,16.527L74.147,17.951L73.754,19.297L76.579,18.547L81.301,19.836L84.931,19.741L88.525,21.755L91.63,24.485L93.502,25.187L95.574,25.286L96.458,26.054L97.28,29.163L97.682,30.647L96.72,34.705L95.478,36.31L92.059,39.745L90.511,42.55L88.709,44.711L88.106,44.757L87.423,46.596L87.598,51.303L86.925,55.205L86.662,56.886L85.893,57.894L85.464,61.328L82.998,64.707L82.587,67.402L80.619,68.538L80.051,70.12L77.409,70.111L73.587,71.127L71.882,72.307L69.162,73.085L66.302,75.208L64.247,77.875L63.888,79.897L64.291,81.4L63.845,84.173L63.294,85.524L61.588,87.051L58.894,91.994L56.761,94.249L55.108,95.592L53.997,98.339Z" fill="currentColor" opacity="0.9" />
          </svg>
        </div>

        <!-- Netherlands Vector -->
        <div id="map-nl" class="absolute w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 flex items-center justify-center opacity-0 drop-shadow-2xl" style="transform: translateX(30vw) scale(1);">
          <svg viewBox="0 0 100 100" class="w-full h-full text-blue-500 overflow-visible">
            <defs>
              <pattern id="nl-flag" viewBox="0 0 100 100" patternUnits="userSpaceOnUse" width="100%" height="100%">
                <rect x="0" y="0" width="100" height="33.33" fill="#AE1C28" />
                <rect x="0" y="33.33" width="100" height="33.34" fill="#FFFFFF" />
                <rect x="0" y="66.67" width="100" height="33.33" fill="#21468B" />
              </pattern>
              <clipPath id="right-half">
                <rect x="50" y="0" width="50" height="100" />
              </clipPath>
            </defs>
            <path class="fill-path" d="M88.625,1.096L92.785,13.935L87.157,48.164L81.447,62.006L67.824,62.006L71.658,100L59.177,91.604L44.82,75.794L23.856,83.35L7.215,80.467L18.88,70.49L38.784,15.916L69.782,0Z" fill="currentColor" opacity="0.9" />
          </svg>
        </div>

        <!-- Glow Burst -->
        <div id="glow-burst" class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[radial-gradient(circle_at_center,_#FFC000_0%,_transparent_60%)] opacity-0 mix-blend-screen pointer-events-none scale-50"></div>
        
      </div>

      <!-- Text -->
      <div class="relative z-20 flex flex-col items-center mt-4">
        <h3 id="fusion-text" class="font-serif text-2xl md:text-4xl text-center text-emerald-100 px-8 opacity-0 font-light drop-shadow-md">
          A distância é apenas um número.<br/><span class="text-yellow-400 tracking-wide mt-3 block font-medium">Nós construímos a ponte.</span>
        </h3>
        
        <div id="fusion-hint" class="mt-8 font-sans text-[10px] tracking-[0.3em] transform uppercase text-emerald-300 opacity-0 flex items-center gap-2 hover:text-emerald-100 transition-colors">
            Toque para continuar <mat-icon class="text-sm w-4 h-4 text-yellow-400">arrow_forward</mat-icon>
        </div>
      </div>
    </div>
  `
})
export class MapFusionComponent implements AfterViewInit {
  flow = inject(FlowService);
  platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.runSequence();
    }
  }

  async runSequence() {
    // 1. Fade in the maps, bouncing slightly
    animate("#map-br", { opacity: 1 }, { duration: 1.5, ease: 'easeOut' });
    animate("#map-nl", { opacity: 1 }, { duration: 1.5, ease: 'easeOut' });

    await new Promise(r => setTimeout(r, 1500));
    
    // 2. Bring them to center 0 overlapping
    animate("#map-br", { x: 0 }, { duration: 2, ease: [0.22, 1, 0.36, 1] });
    animate("#map-nl", { x: 0 }, { duration: 2, ease: [0.22, 1, 0.36, 1] });

    await new Promise(r => setTimeout(r, 1900)); 
    
    // 3. Flash burst
    animate("#glow-burst", 
        { opacity: [0, 0.8, 0], scale: [0.5, 2.5, 3.5] }, 
        { duration: 1.5, ease: 'easeOut' }
    );

    const HEART_PATH = "M50 85 L44 78 C20 57 8 45 8 31 C8 19 18 9 30 9 C38 9 45 13 50 19 C55 13 62 9 70 9 C82 9 92 19 92 31 C92 45 80 57 56 78 L50 85 Z";
    
    const brPaths = document.querySelectorAll('#map-br path');
    const nlPaths = document.querySelectorAll('#map-nl path');

    const tween = (duration: number, onUpdate: (v: number) => void) => {
      const start = performance.now();
      const loop = (time: number) => {
        let p = (time - start) / (duration * 1000);
        if (p > 1) p = 1;
        onUpdate(p * (2 - p)); 
        if (p < 1) requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    };

    // Apply clip paths so left map is left half of heart, right map is right half.
    document.querySelector("#map-br .fill-path")?.setAttribute('clip-path', 'url(#left-half)');
    document.querySelector("#map-nl .fill-path")?.setAttribute('clip-path', 'url(#right-half)');

    brPaths.forEach(p => {
       const interpolator = interpolate(p.getAttribute('d')!, HEART_PATH, { maxSegmentLength: 2 });
       tween(1, (v) => p.setAttribute('d', interpolator(v)));
    });

    nlPaths.forEach(p => {
       const interpolator = interpolate(p.getAttribute('d')!, HEART_PATH, { maxSegmentLength: 2 });
       tween(1, (v) => p.setAttribute('d', interpolator(v)));
    });
    
    animate("#map-br", { scale: 1.2 }, { duration: 1, ease: 'easeOut' });
    animate("#map-nl", { scale: 1.2 }, { duration: 1, ease: 'easeOut' });
    
    setTimeout(() => {
      document.querySelector("#map-br .fill-path")?.setAttribute('fill', 'url(#br-flag)');
      document.querySelector("#map-nl .fill-path")?.setAttribute('fill', 'url(#nl-flag)');
      
      animate("#map-br", { scale: [1.2, 1.4, 1.3] }, { duration: 0.8, ease: 'easeOut' });
      animate("#map-nl", { scale: [1.2, 1.4, 1.3] }, { duration: 0.8, ease: 'easeOut' });
      
      document.querySelector("#map-br svg")?.classList.remove('text-emerald-500');
      document.querySelector("#map-nl svg")?.classList.remove('text-blue-500');
    }, 500);

    animate("#fusion-text", 
        { opacity: [0, 1], y: [20, 0] }, 
        { duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }
    );
    
    animate("#fusion-hint", 
        { opacity: [0, 1] }, 
        { duration: 1.5, delay: 2.5 }
    );
  }

  onNext() {
    this.flow.next();
  }
}
