import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { PrizesCard } from '../prizes-card/prizes-card';
import { Level } from '../level/level';

@Component({
  selector: 'app-body',
  imports: [CommonModule, PrizesCard, Level],
  standalone: true,
  templateUrl: './body.html',
  styleUrls: ['./body.css'], // 
})
export class Body implements AfterViewInit {
  @ViewChild('wheel') wheel!: ElementRef;
  @ViewChild('winnerBanner') winnerBanner!: ElementRef;
  @ViewChild('winnerText') winnerTextEl!: ElementRef<HTMLSpanElement>;

  winnerText = '';
  winnerImage = '';
  spinCount = 1;
  isSpinning = false;
  rotation = 0;
  currentVariant: 'minor' | 'major' | 'grand' = 'minor';

  slices = [
    { title: '500<br>CHIPS', image: 'assets/images/chips-red.png' },
    { title: '100<br>CHIPS', image: 'assets/images/chips-yellow.png' },
    { title: '500<br>CHIPS', image: 'assets/images/chips-red.png' },
    { title: 'FREEBIE' },
    { title: '1000<br>CHIPS', image: 'assets/images/chips-red.png' },
    { title: '100<br>CHIPS', image: 'assets/images/chips-yellow.png' },
    { title: '1000<br>CHIPS', image: 'assets/images/chips-red.png' },
    { title: 'NMAX', image: 'assets/images/nmax.png' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
  }

  getSliceTransform(index: number): string {
    const sliceAngle = 360 / this.slices.length;
    const angle = index * sliceAngle;
    return `rotate(${angle}deg) skewY(${90 - sliceAngle}deg)`;
  }

  onVariantPicked(variant: 'minor' | 'major' | 'grand') {
    if (variant) this.currentVariant = variant;
  }

  getSliceBackground(): string {
    switch (this.currentVariant) {
      case 'major':
        return 'radial-gradient(circle at center, #ff4d4d 0%, #cc0000 50%, #660000 100%)';
      case 'grand':
        return 'radial-gradient(circle at center, #66ccff 0%, #0066cc 50%, #001f4d 100%)';
      case 'minor':
      default:
        return 'radial-gradient(circle at center, #ffae00 0%, #ff9900 50%, #a84b00 100%)';
    }
  }

  // Use same gradient for bulbs so they track the active variant
  getBulbGradient(): string {
    return this.getSliceBackground();
  }

  // Dynamic bulb glow CSS variable providers
  getBulbBaseColor(): string {
    switch (this.currentVariant) {
      case 'major':
        return '#ff2d2d'; // base red glow
      case 'grand':
        return '#2d9cff'; // base blue glow
      case 'minor':
      default:
        return '#ffb400'; // base yellow/orange glow
    }
  }

  getBulbGlow0(): string {
    switch (this.currentVariant) {
      case 'major':
        return 'rgba(255,60,60,0.6)';
      case 'grand':
        return 'rgba(100,180,255,0.6)';
      case 'minor':
      default:
        return 'rgba(255,200,0,0.6)';
    }
  }

  getBulbGlow1(): string {
    switch (this.currentVariant) {
      case 'major':
        return 'rgba(255,60,60,0.9)';
      case 'grand':
        return 'rgba(100,180,255,0.9)';
      case 'minor':
      default:
        return 'rgba(255,200,0,0.9)';
    }
  }

  // Rim glow helpers
  getRimGlow0(): string {
    switch (this.currentVariant) {
      case 'major': return 'rgba(255,70,70,0.6)';
      case 'grand': return 'rgba(120,200,255,0.6)';
      case 'minor':
      default: return 'rgba(255,220,60,0.6)';
    }
  }

  getRimGlow1(): string {
    switch (this.currentVariant) {
      case 'major': return 'rgba(255,40,40,0.4)';
      case 'grand': return 'rgba(60,150,255,0.4)';
      case 'minor':
      default: return 'rgba(255,180,0,0.4)';
    }
  }

  getRimFilterA(): string {
    switch (this.currentVariant) {
      case 'major': return 'rgba(255, 50, 50, 0.8)';
      case 'grand': return 'rgba(80, 170, 255, 0.8)';
      case 'minor':
      default: return 'rgba(255, 220, 50, 0.8)';
    }
  }

  getRimFilterB(): string {
    switch (this.currentVariant) {
      case 'major': return 'rgba(255, 0, 0, 0.6)';
      case 'grand': return 'rgba(0, 110, 200, 0.6)';
      case 'minor':
      default: return 'rgba(255, 160, 0, 0.6)';
    }
  }

  getLabelPosition(index: number): string {
    const total = this.slices.length;
    const sliceAngle = 360 / total;
    const radius = 80; 
    const baseOffset = -90; 

    const angle = index * sliceAngle + sliceAngle / 2 + baseOffset;
    const rad = (angle * Math.PI) / 180;

    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    const rotation = angle + 90;

    return `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`;
  }

  spinWheel() {
    if (this.isSpinning || this.spinCount <= 0) return;

    this.spinCount--;
    this.isSpinning = true;

    const totalSlices = this.slices.length;
    const sliceAngle = 360 / totalSlices;
    const randomIndex = Math.floor(Math.random() * totalSlices);
    const targetAngle = randomIndex * sliceAngle + sliceAngle / 2;
    const finalRotation = 360 * 5 - targetAngle;

    this.rotation = finalRotation;

       gsap.to(this.wheel.nativeElement, {
      rotation: finalRotation,
      duration: 1,
      ease: 'power4.out',
       onComplete: () => {
        this.isSpinning = false;
    // get the item stops at arrow pointer
    const normalized = ((finalRotation % 360) + 360) % 360; 
    const angleFromTop = (360 - normalized) % 360; 
    const winnerIndex = Math.floor(angleFromTop / sliceAngle) % totalSlices;

  
  const prize = this.slices[winnerIndex];
  const prizeText = (prize?.title || '').replace(/<br\s*\/?>/gi, ' ');
  const prizeImg = prize?.image || '';
  this.showWinningAnimation(prizeText || 'Unknown Prize', prizeImg);
        this.launchConfetti();
        gsap.to(this.wheel.nativeElement, {
          rotation: finalRotation + 5,
          duration: 0.3,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        });
      }
    });
  }

  launchConfetti() {
    const end = Date.now() + 2500;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }

 showWinningAnimation(prize: string, imgSrc: string) {
   this.winnerText = `YOU WON: ${prize}! `;
   this.winnerImage = imgSrc;
   this.cdr.detectChanges();
    this.fitWinnerText();
    const banner = this.winnerBanner.nativeElement;
    const img: HTMLImageElement | null = banner.querySelector('img');
    if (img && !img.complete) {
      img.onload = () => this.fitWinnerText();
    }
    gsap.set(banner, { opacity: 0, scale: 0.5, y: 50 });
    gsap.to(banner, { opacity: 1, scale: 1.2, y: 0, duration: 1, ease: 'back.out(1.7)' });
    gsap.to(banner, { scale: 1, duration: 0.4, delay: 1, ease: 'back.inOut(2)' });
    gsap.to(banner, { opacity: 0, duration: 1, delay: 3, ease: 'power1.out' });
  }

  private fitWinnerText() {
    try {
      const banner: HTMLElement = this.winnerBanner?.nativeElement;
      const textEl: HTMLElement = this.winnerTextEl?.nativeElement;
      if (!banner || !textEl) return;

      textEl.style.whiteSpace = 'nowrap';

      textEl.style.fontSize = '';
      const computed = window.getComputedStyle(textEl);
      let baseSize = parseFloat(computed.fontSize || '16');
      if (!isFinite(baseSize) || baseSize <= 0) baseSize = 16;

      const bannerStyles = window.getComputedStyle(banner);
      const paddingLeft = parseFloat(bannerStyles.paddingLeft || '0');
      const paddingRight = parseFloat(bannerStyles.paddingRight || '0');
      const gap = parseFloat((bannerStyles as any).gap || bannerStyles.columnGap || '0');

      const imgEl = banner.querySelector('img') as HTMLElement | null;
      const imgWidth = imgEl ? imgEl.clientWidth : 0;

      const maxBannerWidth = Math.floor(window.innerWidth * 0.9); 
      
      let available = maxBannerWidth - paddingLeft - paddingRight - imgWidth - gap - 4;
      if (!isFinite(available) || available < 0) available = 0;

      
      const minSize = 10; 
      let size = baseSize;
      textEl.style.fontSize = size + 'px';

      
      let safety = 100; 
      while (textEl.scrollWidth > available && size > minSize && safety-- > 0) {
        size -= 1;
        textEl.style.fontSize = size + 'px';
      }
    } catch {
    }
  }
}
