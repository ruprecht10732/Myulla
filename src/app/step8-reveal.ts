import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, signal, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import confetti from 'canvas-confetti';
import { FlowService } from './flow.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-gift-reveal',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="relative w-full h-full bg-emerald-950 flex flex-col items-center justify-center overflow-hidden" #container>
      
      <!-- Subtle ambient luxury glow -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/15 via-emerald-950 to-emerald-950 pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <!-- The Real Gift Card (Revealed) -->
      <div class="relative z-10 w-[90%] max-w-[550px] min-h-[320px] sm:min-h-0 sm:aspect-[1.7/1] rounded-2xl flex flex-col overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
           style="background-color: #ea1d2c;"
           [style.boxShadow]="isRevealed ? '0 0 80px rgba(234,29,44,0.4), 0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(0,0,0,0.3)'"
           [style.transform]="giftTransform()"
           [class.opacity-0]="opacity() === 0"
           [class.scale-95]="opacity() === 0"
           [class.opacity-100]="opacity() > 0"
           [class.scale-100]="opacity() > 0"
           id="gift-card-element">
           
          <!-- Subtle red gradient for volume -->
          <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%);"></div>
          
          <!-- Decorative Background Element -->
          <mat-icon class="absolute -right-12 -bottom-12 transform -rotate-12 pointer-events-none" style="color: #ffffff; opacity: 0.04; font-size: 200px; width: 200px; height: 200px;">outdoor_grill</mat-icon>
          <mat-icon class="absolute -left-12 -top-12 transform -rotate-12 pointer-events-none" style="color: #ffffff; opacity: 0.04; font-size: 200px; width: 200px; height: 200px;">lunch_dining</mat-icon>

          <!-- Top Header -->
          <div class="w-full flex justify-between items-center p-5 sm:p-7 z-10">
             <img src="https://static.ifood.com.br/image/upload/t_low/discoveries/IfoodLogo_hN0s.png" class="h-7 sm:h-9 object-contain brightness-0 invert" style="filter: drop-shadow(0 4px 3px rgba(0,0,0,0.2));" alt="iFood" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3268/3268808.png'" />
             <div class="backdrop-blur-md px-4 py-1.5 rounded-full font-sans font-bold text-[10px] sm:text-xs tracking-widest uppercase flex items-center gap-2" style="background-color: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                <span class="material-icons" style="font-size: 14px;">card_giftcard</span>
                <span>Cartão Presente</span>
             </div>
          </div>

          <!-- Content Space -->
          <div class="flex-1 flex flex-col justify-center px-5 sm:px-8 z-10 w-full mb-1">
             <h3 class="font-serif italic font-light text-xl sm:text-3xl lg:text-4xl leading-none mb-1" style="color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Para seus</h3>
             <h2 class="font-sans font-black tracking-tight text-2xl sm:text-4xl lg:text-5xl uppercase mt-[-4px]" style="color: #ffffff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Produtos de Skincare</h2>
             
             <!-- Amount -->
             <div class="mt-2 sm:mt-3 inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-white/20 self-start shadow-inner">
                <span class="font-sans font-black text-2xl sm:text-3xl lg:text-4xl text-yellow-300 drop-shadow-md tracking-tight">R$ 300,00</span>
             </div>
          </div>

          <!-- Bottom Footer Area -->
          <div class="w-full p-4 sm:p-6 backdrop-blur-sm z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto" style="background-color: rgba(0,0,0,0.1); border-top: 1px solid rgba(255,255,255,0.1);">
             
             <!-- Code Copy Button -->
             <button class="relative group flex items-center justify-between sm:justify-start gap-4 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all w-full sm:w-auto"
                  style="background-color: #ffffff; border: 1px solid transparent; box-shadow: 0 4px 15px rgba(0,0,0,0.1);"
                  onmouseover="this.style.backgroundColor='#f9fafb'; this.style.borderColor='#ffffff'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.15)';"
                  onmouseout="this.style.backgroundColor='#ffffff'; this.style.borderColor='transparent'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)';"
                  (click)="copyCode('GK6TPPFY96RQRX')" title="Copiar código">
                <div class="flex flex-col items-start -mt-0.5">
                   <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest" style="color: #6b7280;">{{ copied() ? 'Copiado!' : 'Código do Presente' }}</span>
                   <span class="font-mono font-bold text-base sm:text-lg tracking-[0.1em] sm:tracking-[0.15em]" style="color: #dc2626; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">{{ copied() ? 'Copiado! ✓' : 'GK6TPPFY96RQRX' }}</span>
                </div>
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all ml-2" style="background-color: #fef2f2; color: #ef4444;"
                     onmouseover="this.style.transform='scale(1.1)'; this.style.backgroundColor='#fee2e2';"
                     onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='#fef2f2';">
                   <span class="material-icons" style="font-size: 18px;">{{ copied() ? 'check' : 'content_copy' }}</span>
                </div>
             </button>

             <!-- From/To -->
             <div class="flex gap-4 text-right sm:text-left self-end sm:self-center mr-2" style="color: #ffffff;">
                <div class="flex flex-col justify-end items-end sm:items-start">
                   <span class="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mb-0.5" style="color: rgba(255,255,255,0.7);">De</span>
                   <span class="font-sans font-bold text-sm sm:text-base leading-none" style="text-shadow: 0 1px 2px rgba(0,0,0,0.2);">Robin</span>
                </div>
                <div class="w-[1px] self-stretch my-1" style="background-color: rgba(255,255,255,0.2);"></div>
                <div class="flex flex-col justify-end items-start">
                   <span class="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mb-0.5" style="color: rgba(255,255,255,0.7);">Para</span>
                   <span class="font-sans font-bold text-sm sm:text-base leading-none" style="text-shadow: 0 1px 2px rgba(0,0,0,0.2);">Myulla</span>
                </div>
             </div>
          </div>
      </div>

      <!-- Hint (visible during tearing) -->
      @if (!isRevealed) {
      <div class="absolute top-[15%] left-0 right-0 z-40 flex flex-col items-center pointer-events-none transition-opacity duration-1000 delay-1000" [class.opacity-100]="opacity() > 0" [class.opacity-0]="opacity() === 0">
        <div class="bg-black/80 text-emerald-100 backdrop-blur-md px-6 py-2 rounded-full font-sans text-xs tracking-widest uppercase flex items-center gap-2 border border-white/20 animate-bounce drop-shadow-lg font-bold">
          <mat-icon class="text-[16px] w-4 h-4 text-yellow-400">touch_app</mat-icon> Rasgue o papel de presente
        </div>
      </div>
      }

      <!-- Reveal buttons -->
      @if (isRevealed) {
      <div class="absolute bottom-6 md:bottom-12 z-50 flex flex-col sm:flex-row gap-4 animate-fade-in items-center px-4 w-full justify-center">
         <button (click)="downloadPdf()"
                 class="group relative px-6 py-3 bg-red-600 text-white rounded-xl font-sans font-bold text-sm tracking-widest uppercase shadow-xl hover:shadow-2xl transition-all md:hover:-translate-y-1 flex items-center justify-center gap-2 border-2 border-red-500 hover:bg-red-500 w-full sm:w-auto">
            <mat-icon class="text-[18px]">download</mat-icon>
            Baixar PDF 
         </button>
         <a href="https://www.ifood.com.br" target="_blank"
                 class="group relative px-6 py-3 bg-black text-white rounded-xl font-sans font-bold text-sm tracking-widest uppercase shadow-xl hover:shadow-2xl transition-all md:hover:-translate-y-1 flex items-center justify-center gap-2 border-2 border-black hover:bg-gray-900 w-full sm:w-auto">
            <mat-icon class="text-[18px]">open_in_new</mat-icon>
            Abrir iFood
         </a>
      </div>
      }

      <!-- Restart button -->
      @if (isRevealed) {
      <button (click)="restart()"
              class="absolute top-8 right-8 group relative p-3 bg-white/10 hover:bg-white/20 rounded-full text-emerald-100 border border-white/20 backdrop-blur-sm transition-all duration-300 shadow-xl outline-none overflow-hidden z-50 animate-fade-in">
         <mat-icon class="w-5 h-5 text-sm flex justify-center items-center">home</mat-icon>
      </button>
      }

      <!-- Scratch Canvas (The Wrapping Paper) -->
      <canvas #scratchCanvas 
              class="absolute inset-0 z-30 touch-none transition-all duration-[1500ms] ease-out"
              [class.opacity-0]="isRevealed"
              [class.scale-110]="isRevealed"
              [class.pointer-events-none]="isRevealed"
              (mousedown)="startDrawing($event)"
              (mousemove)="draw($event)"
              (mouseup)="stopDrawing()"
              (mouseleave)="stopDrawing()"
              (touchstart)="startDrawing($event)"
              (touchmove)="draw($event)"
              (touchend)="stopDrawing()"
              (touchcancel)="stopDrawing()">
      </canvas>

    </div>
  `
})
export class GiftRevealComponent implements AfterViewInit {
  @ViewChild('scratchCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private totalPixels = 0;
  
  isRevealed = false;
  opacity = signal(0);
  giftTransform = signal('rotate(0deg)');
  copied = signal(false);

  private scratchBrushPattern!: HTMLCanvasElement;
  platformId = inject(PLATFORM_ID);
  flowService = inject(FlowService);

  async downloadPdf() {
    if (!isPlatformBrowser(this.platformId)) return;
    const cardEl = document.getElementById('gift-card-element');
    if (!cardEl) return;
    
    // Temporarily reset transform so html2canvas captures flat
    const originalTransform = cardEl.style.transform;
    cardEl.style.transform = 'none';

    try {
      const canvas = await html2canvas(cardEl, { scale: 2, backgroundColor: null });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save('Cartao-iFood-Myulla.pdf');
    } catch (e) {
      console.error('PDF generation failed', e);
    } finally {
      cardEl.style.transform = originalTransform;
    }
  }

  copyCode(code: string) {
    if (!isPlatformBrowser(this.platformId)) return;
    
    try {
      // 1. Always attempt the synchronous fallback first
      // This is crucial in iframes because if we await navigator.clipboard, 
      // we lose the user gesture context for execCommand.
      const el = document.createElement('textarea');
      el.value = code;
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      const success = document.execCommand('copy');
      document.body.removeChild(el);
      
      // 2. If it succeeded, or if we have modern clipboard API, we are good
      if (success) {
         this.copied.set(true);
         setTimeout(() => this.copied.set(false), 2000);
      } else if (navigator.clipboard) {
         navigator.clipboard.writeText(code).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
         }).catch(err => console.error('Clipboard API failed', err));
      }
    } catch (err) {
      console.error('Copy failed', err);
    }
  }

  restart() {
    this.flowService.reset();
  }

  ngAfterViewInit() {
     if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
           this.opacity.set(1);
        }, 100);

        this.scratchBrushPattern = document.createElement('canvas');
        this.scratchBrushPattern.width = 120;
        this.scratchBrushPattern.height = 120;
        const bctx = this.scratchBrushPattern.getContext('2d');
        if (bctx) {
            bctx.fillStyle = 'black';
            bctx.beginPath();
            for (let i = 0; i < Math.PI * 2; i += 0.4) {
                const r = 40 + Math.random() * 20;
                bctx.lineTo(60 + Math.cos(i) * r, 60 + Math.sin(i) * r);
            }
            bctx.fill();
        }

        this.setupCanvas();
        window.addEventListener('resize', () => {
          if(!this.isRevealed) this.setupCanvas();
        });
     }
  }

  setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const container = this.containerRef.nativeElement;
    
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    
    this.totalPixels = canvas.width * canvas.height;
    
    // Draw wealthy wrapping paper (Very dark slate/charcoal with gold subtle stripes)
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 60;
    patternCanvas.height = 60;
    const pctx = patternCanvas.getContext('2d')!;
    pctx.fillStyle = '#022c22'; // emerald-950
    pctx.fillRect(0,0,60,60);
    pctx.fillStyle = '#FFC000';
    pctx.globalAlpha = 0.08;
    pctx.beginPath();
    pctx.moveTo(0,60); pctx.lineTo(60,0);
    pctx.lineWidth = 1.5;
    pctx.stroke();

    const pattern = this.ctx.createPattern(patternCanvas, 'repeat');
    if(pattern) this.ctx.fillStyle = pattern;
    else this.ctx.fillStyle = '#022c22';
    
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add ribbon (Luxurious Gold)
    this.ctx.globalAlpha = 1;
    
    // Create gold gradient for ribbon
    const rbGrad1 = this.ctx.createLinearGradient(canvas.width / 2 - 20, 0, canvas.width / 2 + 20, 0);
    rbGrad1.addColorStop(0, '#B8860B');
    rbGrad1.addColorStop(0.5, '#FFD700');
    rbGrad1.addColorStop(1, '#B8860B');
    
    const rbGrad2 = this.ctx.createLinearGradient(0, canvas.height / 2 - 20, 0, canvas.height / 2 + 20);
    rbGrad2.addColorStop(0, '#B8860B');
    rbGrad2.addColorStop(0.5, '#FFD700');
    rbGrad2.addColorStop(1, '#B8860B');

    this.ctx.fillStyle = rbGrad1;
    this.ctx.fillRect(canvas.width / 2 - 20, 0, 40, canvas.height);
    this.ctx.fillStyle = rbGrad2;
    this.ctx.fillRect(0, canvas.height / 2 - 20, canvas.width, 40);
  }

  getCoordinates(e: MouseEvent | TouchEvent): { x: number, y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  startDrawing(e: MouseEvent | TouchEvent) {
    if (this.isRevealed) return;
    this.isDrawing = true;
    const coords = this.getCoordinates(e);
    this.lastX = coords.x;
    this.lastY = coords.y;
    this.draw(e);
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.isDrawing || this.isRevealed) return;
    e.preventDefault(); 
    
    const coords = this.getCoordinates(e);
    
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'destination-out';
    
    const dist = Math.hypot(coords.x - this.lastX, coords.y - this.lastY);
    const steps = Math.max(Math.floor(dist / 15), 1);
    
    for(let i=0; i<steps; i++) {
        const x = this.lastX + (coords.x - this.lastX) * (i/steps);
        const y = this.lastY + (coords.y - this.lastY) * (i/steps);
        ctx.drawImage(this.scratchBrushPattern, x - 60, y - 60);
    }
    
    this.lastX = coords.x;
    this.lastY = coords.y;

    this.checkRevealCompletion();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  checkRevealCompletion() {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;
    const stride = 50; 
    let cleared = 0;
    let total = 0;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < imageData.length; i += 4 * stride) {
       total++;
       if (imageData[i+3] < 128) cleared++;
    }
    
    const percent = cleared / total;
    
    if (percent > 0.45) {
        this.triggerReveal();
    }
  }

  triggerReveal() {
      if(this.isRevealed) return;
      this.isRevealed = true;
      this.stopDrawing();
      
      const duration = 4000;
      const end = Date.now() + duration;

      const frame = () => {
          confetti({
              particleCount: 5,
              angle: 60,
              spread: 60,
              origin: { x: 0 },
              colors: ['#FFD700', '#F8FAFC', '#9CA3AF'],
              disableForReducedMotion: true
          });
          confetti({
              particleCount: 5,
              angle: 120,
              spread: 60,
              origin: { x: 1 },
              colors: ['#FFD700', '#F8FAFC', '#9CA3AF'],
              disableForReducedMotion: true
          });

          if (Date.now() < end) {
              requestAnimationFrame(frame);
          }
      };
      frame();
  }

  @HostListener('window:deviceorientation', ['$event'])
  onDeviceOrientation(event: DeviceOrientationEvent) {
    if(!this.isRevealed) return;
    
    const maxTilt = 10;
    let beta = event.beta;
    let gamma = event.gamma;
    
    if(beta === null || gamma === null) return;
    
    beta = beta - 45; 
    
    beta = Math.max(-maxTilt, Math.min(maxTilt, beta));
    gamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));
    
    const rotX = -beta; 
    const rotY = gamma;
    
    this.giftTransform.set(`perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`);
  }
  
  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
      if(!this.isRevealed) return;
      if (window.DeviceOrientationEvent && typeof (window as unknown as { DeviceOrientationEvent: { requestPermission?: unknown } }).DeviceOrientationEvent?.requestPermission === 'function') {
          return;
      }
      
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      
      this.giftTransform.set(`perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.05)`);
  }
}
