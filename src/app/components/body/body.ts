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

  slices = [
    { title: '500<br>CHIPS', image: 'assets/images/chips-red.png' },
    { title: '100<br>CHIPS', image: 'assets/images/chips-yellow.png' },
    { title: '500<br>CHIPS', image: 'assets/images/chips-red.png' },
    { title: 'FREEBIE', image: 'assets/images/nmax.png' },
    { title: '1000<br>CHIPS', image: 'assets/images/chips-red.png' },
    { title: '100<br>CHIPS', image: 'assets/images/chips-yellow.png' },
    { title: '1000<br>CHIPS', image: 'assets/images/chips-red.png' },
    { title: 'NMAX', image: 'assets/images/nmax.png' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Slices are now positioned via template binding, no need for manual DOM manipulation
    console.log('Wheel initialized with', this.slices.length, 'slices');
  }

  getSliceTransform(index: number): string {
    const sliceAngle = 360 / this.slices.length;
    const angle = index * sliceAngle;
    return `rotate(${angle}deg) skewY(${90 - sliceAngle}deg)`;
  }

  getLabelPosition(index: number): string {
    const total = this.slices.length;
    const sliceAngle = 360 / total;
    const radius = 80; // adjust inward/outward
    const baseOffset = -90; // aligns first slice at top

    const angle = index * sliceAngle + sliceAngle / 2 + baseOffset;
    const rad = (angle * Math.PI) / 180;

    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    const rotation = angle + 90;

    // Center the label by its own midpoint, then move to the target point and rotate
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
      duration: 10,
      ease: 'power4.out',
       onComplete: () => {
        this.isSpinning = false;
    // Determine winner by where the arrow stops (top) using the final rotation
    const normalized = ((finalRotation % 360) + 360) % 360; // 0..359
    const angleFromTop = (360 - normalized) % 360; // angle aligned with arrow at top
    const winnerIndex = Math.floor(angleFromTop / sliceAngle) % totalSlices;

    // Winner content should come from the data model (labels are rendered separately)
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
   this.winnerText = `YOU WON: ${prize}! 🎉`;
   this.winnerImage = imgSrc;
   // Ensure bindings update immediately even if triggered from an animation callback
   this.cdr.detectChanges();
    // Fit text to a single line by shrinking font size if needed
    this.fitWinnerText();
    const banner = this.winnerBanner.nativeElement;
    // Refit after image loads (image width affects available text space)
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

      // Ensure one line
      textEl.style.whiteSpace = 'nowrap';

      // Reset to computed base font size from CSS/Tailwind before measuring
      textEl.style.fontSize = '';
      const computed = window.getComputedStyle(textEl);
      let baseSize = parseFloat(computed.fontSize || '16');
      if (!isFinite(baseSize) || baseSize <= 0) baseSize = 16;

      // Compute available width = bannerWidth - padding - gap - imageWidth
      const bannerStyles = window.getComputedStyle(banner);
      const paddingLeft = parseFloat(bannerStyles.paddingLeft || '0');
      const paddingRight = parseFloat(bannerStyles.paddingRight || '0');
      // gap can be reported as 'gap' or 'columnGap' depending on layout
      const gap = parseFloat((bannerStyles as any).gap || bannerStyles.columnGap || '0');

      const imgEl = banner.querySelector('img') as HTMLElement | null;
      const imgWidth = imgEl ? imgEl.clientWidth : 0;

      const maxBannerWidth = Math.floor(window.innerWidth * 0.9); // matches max-w-[90vw]
      // banner.clientWidth respects current content caps; use the 90vw cap for headroom
      let available = maxBannerWidth - paddingLeft - paddingRight - imgWidth - gap - 4;
      if (!isFinite(available) || available < 0) available = 0;

      // If there's effectively no space, just clamp to minimum
      const minSize = 10; // px
      let size = baseSize;
      textEl.style.fontSize = size + 'px';

      // Shrink until text fits the available width or we hit the minimum size
      // scrollWidth doesn't include transforms; good for measuring intrinsic width
      let safety = 100; // prevent infinite loops
      while (textEl.scrollWidth > available && size > minSize && safety-- > 0) {
        size -= 1;
        textEl.style.fontSize = size + 'px';
      }
    } catch {
      // Non-fatal; if measurement fails, default CSS sizes will apply
    }
  }
}
