import { Component, ElementRef, ViewChild, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlowService } from './flow.service';
import { toJpeg } from 'html-to-image';

@Component({
  selector: 'app-selfie',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" style="background-color: #022c22;">
      
      <!-- Screen Flash -->
      @if (flashOn()) {
      <div class="absolute inset-0 bg-white z-50 transition-opacity duration-300 pointer-events-none" [class.opacity-0]="opacityZero()"></div>
      }

      <!-- Permission Request Overlay -->
      @if (!cameraActive() && !photoCaptured()) {
      <div class="absolute inset-0 z-40 backdrop-blur-md flex items-center justify-center p-6" style="background-color: rgba(2, 44, 34, 0.9);">
        <div class="border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transform transition-transform" style="background-color: #064e3b;">
           <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5" style="color: #facc15;">
             <mat-icon class="text-3xl">camera_alt</mat-icon>
           </div>
           <h3 class="font-serif text-2xl mb-2 text-emerald-100">Uma Selfie Nossa</h3>
           <p class="font-sans text-emerald-300 mb-8 leading-relaxed text-sm">
             Por favor, permita o acesso à câmera para finalizarmos esta linda lembrança.
           </p>
           <button (click)="requestCamera()" class="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-emerald-100 rounded-xl font-sans tracking-widest text-xs uppercase font-bold transition-all shadow-lg">
             Permitir Câmera
           </button>
        </div>
      </div>
      }

      <!-- Main UI: Camera (Before Capture) -->
      @if (!photoCaptured()) {
      <div class="relative z-10 flex flex-col items-center w-full max-w-lg px-4 transition-all duration-1000" [class.opacity-0]="!cameraActive()">
        
        <!-- The Frame / Viewport -->
        <div class="relative w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full 
                    shadow-[0_0_50px_rgba(255,192,0,0.1)] 
                    before:content-[''] before:absolute before:-inset-4 before:rounded-full before:border-2 before:border-yellow-400/30
                    after:content-[''] after:absolute after:-inset-8 after:rounded-full after:border after:border-white/5">
          
          <!-- Video feed -->
          <video #videoElement 
                 class="w-full h-full object-cover rounded-full scale-x-[-1]"
                 style="background-color: #064e3b;"
                 autoplay playsinline muted>
          </video>
          
          <!-- Countdown Overlay -->
          @if (countdownValue() > 0) {
          <div class="absolute inset-0 flex items-center justify-center rounded-full z-30 transition-all" style="background-color: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
             <span class="font-serif text-8xl font-bold drop-shadow-[0_0_20px_rgba(255,192,0,0.5)]" style="color: #facc15;">{{ countdownValue() }}</span>
          </div>
          }
        </div>

        <!-- Controls -->
        <div class="mt-20 h-20 flex items-center justify-center">
            @if (cameraActive() && !isCountingDown()) {
            <button (click)="startCaptureSequence()"
                    class="w-20 h-20 rounded-full bg-transparent border-[3px] border-yellow-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,192,0,0.2)] hover:scale-105 transition-all p-1 outline-none">
               <div class="w-full h-full rounded-full transition-colors" style="background-color: #facc15;" onmouseover="this.style.backgroundColor='#fde047'" onmouseout="this.style.backgroundColor='#facc15'"></div>
            </button>
            }
        </div>
      </div>
      }

      <!-- Captured Scene -->
      @if (photoCaptured()) {
      <div class="absolute inset-0 z-20 flex flex-col items-center justify-start overflow-y-auto scrollbar-hide py-6" style="background-color: #022c22;">
          
          <div class="flex-1 flex flex-col items-center justify-center w-full min-h-max drop-shadow-2xl">
             <!-- Wrapper for html-to-image (Uses inline styles for html2canvas compatibility) -->
             <div id="capture-area" class="relative w-[360px] sm:w-[420px] h-[540px] sm:h-[620px] flex-shrink-0 rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-[6px] border-[#facc15] bg-[#064e3b] flex flex-col items-center justify-between pt-8 pb-0 px-6 box-border" style="background-image: radial-gradient(circle at bottom right, #022c22, #064e3b);">
               
               <!-- Particles/Noise -->
               <div class="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none" style="background-image: url('https://www.transparenttextures.com/patterns/stardust.png');"></div>
               
               <!-- Beautiful Background Windmill (Dutch Element) -->
               <div class="absolute top-[8%] right-[-10%] opacity-20 pointer-events-none text-yellow-400 w-56 h-56 z-0">
                  <svg viewBox="0 0 200 200" fill="currentColor" class="w-full h-full drop-shadow-lg">
                     <path d="M80,180 L120,180 L110,80 L90,80 Z" />
                     <path d="M90,80 Q100,50 110,80 Z" />
                     <!-- blades -->
                     <g transform="translate(100, 80) rotate(15)">
                        <rect x="-3" y="-80" width="6" height="160" />
                        <rect x="-80" y="-3" width="160" height="6" />
                        <!-- sails -->
                        <rect x="3" y="-75" width="20" height="60" fill-opacity="0.8"/>
                        <rect x="-23" y="15" width="20" height="60" fill-opacity="0.8"/>
                        <rect x="15" y="3" width="60" height="20" fill-opacity="0.8"/>
                        <rect x="-75" y="-23" width="60" height="20" fill-opacity="0.8"/>
                     </g>
                  </svg>
               </div>

               <!-- Beautiful Background Christ the Redeemer (Brazil Element) -->
               <div class="absolute bottom-[20%] left-[-15%] opacity-20 pointer-events-none text-[#a7f3d0] w-64 h-64 z-0">
                  <svg viewBox="0 0 200 200" fill="currentColor" class="w-full h-full drop-shadow-lg">
                     <!-- Hill -->
                     <path d="M10,180 Q100,100 190,180 Z" />
                     <!-- Base -->
                     <rect x="90" y="125" width="20" height="15" />
                     <!-- Body -->
                     <path d="M92,80 L88,125 L112,125 L108,80 Z" />
                     <!-- Arms -->
                     <rect x="50" y="85" width="100" height="8" rx="2" />
                     <!-- Head -->
                     <rect x="92" y="65" width="16" height="18" rx="6" />
                  </svg>
               </div>

               <!-- TOP EMOJI CORNERS -->
               <div class="absolute -top-4 -left-2 text-[4.5rem] drop-shadow-xl z-20" style="transform: rotate(-15deg);">🌷</div>
               <div class="absolute -top-4 -right-2 text-[4.5rem] drop-shadow-xl z-20" style="transform: rotate(15deg);">🧀</div>

               <!-- BALLOONS -->
               <div class="absolute top-[8%] left-[10%] text-[3rem] drop-shadow-xl z-10" style="transform: rotate(-10deg);">🎈</div>
               <div class="absolute top-[10%] right-[12%] text-[2.5rem] drop-shadow-xl z-10" style="transform: rotate(15deg);">🎈</div>
               
               <!-- EXTRA BRAZIL/DUTCH ELEMENTS -->
               <div class="absolute top-[38%] -left-8 text-[3.5rem] drop-shadow-xl z-20" style="transform: rotate(30deg);">🦜</div>
               <div class="absolute bottom-[40%] -right-6 text-[3.5rem] drop-shadow-xl z-20" style="transform: rotate(-20deg);">🚲</div>
               <div class="absolute top-[35%] -right-4 text-[2.5rem] drop-shadow-xl z-20" style="transform: rotate(-15deg);">🍺</div>

               <!-- MAIN TITLES -->
               <div class="relative z-10 text-center w-full drop-shadow-md">
                  <h2 class="text-2xl sm:text-3xl font-serif italic text-yellow-300">Gefeliciteerd,</h2>
                  <h1 class="text-4xl sm:text-5xl font-black font-sans text-white uppercase tracking-widest mt-1" style="text-shadow: 0 4px 6px rgba(0,0,0,0.5);">MYULLA!</h1>
               </div>

               <!-- THE PHOTO FRAME -->
               <div class="relative z-20 w-52 h-52 sm:w-64 sm:h-64 rounded-full border-[6px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-black mt-4 mb-auto flex items-center justify-center flex-shrink-0">
                  @if (capturedImage) {
                  <img [src]="capturedImage" class="w-full h-full rounded-full object-cover" crossorigin="anonymous" alt="Selfie da Myulla" />
                  }
                  
                  <!-- FLAGS AND CAKES OVERLAPPING -->
                  <div class="absolute -bottom-8 -right-6 text-[4.5rem] drop-shadow-2xl z-30" style="transform: rotate(10deg);">🎂</div>
                  <div class="absolute -top-4 -right-6 text-[3.5rem] drop-shadow-xl z-30" style="transform: rotate(20deg);">🇳🇱</div>
                  <div class="absolute -bottom-2 -left-6 text-[3.5rem] drop-shadow-xl z-30" style="transform: rotate(-20deg);">🇧🇷</div>
               </div>

               <!-- BOTTOM TEXT BOARD -->
               <div class="relative z-10 w-[120%] text-center bg-black/50 backdrop-blur-md px-8 pt-5 pb-6 border-t border-yellow-400/30 flex flex-col items-center justify-center shrink-0">
                  <p class="text-white text-sm sm:text-base font-sans font-medium leading-relaxed drop-shadow-sm">
                     Da Holanda para o Brasil com muito amor.<br/>Separados por um oceano, unidos pelo coração!
                  </p>
                  <div class="flex justify-center mt-3 gap-3 text-2xl drop-shadow-lg">
                     <span>🎊</span><span>🥳</span><span>🎁</span><span>✨</span>
                  </div>
               </div>
             </div>
          </div>

          <!-- Buttons overlaid separately, NOT captured in image! -->
          <div class="z-40 text-center px-4 w-full flex flex-col md:flex-row gap-4 items-center justify-center max-w-sm sm:max-w-md mx-auto mt-6 pointer-events-auto">
             
             <button (click)="downloadImage()" class="w-full md:w-auto px-6 py-4 backdrop-blur-md rounded-full font-sans tracking-widest text-[10px] sm:text-xs uppercase font-bold transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] border border-white/20 text-white flex items-center justify-center gap-2 flex-1"
                     onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseout="this.style.backgroundColor='transparent'">
                 <mat-icon class="text-[18px] w-[18px] h-[18px]">download</mat-icon> Baixar Imagem
             </button>

             <button (click)="onNext()" class="w-full md:w-auto px-8 py-4 rounded-full font-sans tracking-widest text-[10px] sm:text-xs uppercase font-bold transition-all shadow-[0_10px_30px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2 flex-1"
                     style="background-color: #facc15; color: #022c22;"
                     onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                 Ver Presente <mat-icon class="text-[18px] w-[18px] h-[18px]">arrow_forward</mat-icon>
             </button>
          </div>
      </div>
      }
    </div>
  `
})
export class SelfieComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  
  flow = inject(FlowService);
  
  cameraActive = signal(false);
  isCountingDown = signal(false);
  countdownValue = signal(0);
  flashOn = signal(false);
  opacityZero = signal(false);
  photoCaptured = signal(false);
  capturedImage: string | null = null;
  
  mediaStream: MediaStream | null = null;

  async requestCamera() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
          audio: false
      });
      
      this.videoElement.nativeElement.srcObject = this.mediaStream;
      this.cameraActive.set(true);
    } catch (err) {
      console.error("Camera access denied or failed:", err);
      this.cameraActive.set(true);
      this.simulateCaptureFallback();
    }
  }

  simulateCaptureFallback() {
    const canvas = document.createElement('canvas');
    canvas.width = 720; canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if(ctx){
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(0,0,720,720);
        ctx.fillStyle = '#facc15';
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhuma Câmera', 360, 360);
    }
    this.capturedImage = canvas.toDataURL('image/jpeg');
    this.photoCaptured.set(true);
    this.stopCamera();
  }

  startCaptureSequence() {
    this.isCountingDown.set(true);
    this.countdownValue.set(3);
    
    let cnt = 3;
    const interval = setInterval(() => {
        cnt--;
        if (cnt > 0) {
            this.countdownValue.set(cnt);
        } else {
            clearInterval(interval);
            this.countdownValue.set(0);
            this.takeSnapshot();
        }
    }, 1000);
  }

  takeSnapshot() {
    this.flashOn.set(true);
    this.opacityZero.set(false);
    
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if(ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.capturedImage = canvas.toDataURL('image/jpeg', 0.9);
    }
    
    this.photoCaptured.set(true);
    this.stopCamera();

    setTimeout(() => {
        this.opacityZero.set(true);
        setTimeout(() => this.flashOn.set(false), 300);
    }, 50);
  }

  stopCamera() {
    if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(t => t.stop());
        this.mediaStream = null;
    }
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async downloadImage() {
    const node = document.getElementById('capture-area');
    if (!node) return;
    
    try {
      const dataUrl = await toJpeg(node, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'aniversario-myulla-selfie.jpg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture image', err);
    }
  }

  onNext() {
    this.flow.next();
  }
}
