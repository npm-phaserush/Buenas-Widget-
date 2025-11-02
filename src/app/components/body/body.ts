import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { PrizesCard } from '../prizes-card/prizes-card';
import { Level } from '../level/level';

@Component({
  selector: 'app-body',
  imports: [CommonModule, PrizesCard, Level],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body implements AfterViewInit {
  @ViewChild('wheel') wheel!: ElementRef;
  @ViewChild('winnerBanner') winnerBanner!: ElementRef;

  winnerText = '';
  winnerImage = '';
  spinCount = 1;
  isSpinning = false;
  rotation = 0;

  slices = [
    { title: '500 CHIPS', image: 'assets/images/chips-red.png' },
    { title: '100 CHIPS', image: 'assets/images/chips-yellow.png' },
    { title: '500 CHIPS', image: 'assets/images/chips-red.png' },
    { title: 'FREEBIE', image: 'assets/images/nmax.png' },
    { title: '1000 CHIPS', image: 'assets/images/chips-red.png' },
    { title: '100 CHIPS', image: 'assets/images/chips-yellow.png' },
    { title: '1000 CHIPS', image: 'assets/images/chips-red.png' },
    { title: ' NMAX', 
      image: 'assets/images/nmax.png' },
  ];

  ngAfterViewInit() {
    const sliceAngle = 360 / this.slices.length;
    const sliceElements = this.wheel.nativeElement.querySelectorAll('.slice');
    sliceElements.forEach((slice: HTMLElement, index: number) => {
      const angle = index * sliceAngle;
      slice.style.transform = `rotate(${angle}deg) skewY(${90 - sliceAngle}deg)`;
    });
  }

getLabelPosition(index: number): string {
  const total = this.slices.length;
  const sliceAngle = 360 / total;
  const radius = 115; // distance from center — adjust to move labels inward/outward
  const baseOffset = -90; // aligns first slice with top; adjust if labels sit between slices

  // angle to center of slice
  const angle = index * sliceAngle + sliceAngle / 2 + baseOffset;
  const rad = (angle * Math.PI) / 180;

  // label position in circle
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  // rotation: rotate with slice (not upright)
  const rotation = angle + 90; // +90 aligns text with radial direction

  return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
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
      duration: 5,
      ease: 'power4.out',
      onComplete: () => {
        this.isSpinning = false;
        const prize = this.slices[randomIndex];
        this.showWinningAnimation(prize.title, prize.image);
        this.launchConfetti();
        gsap.to(this.wheel.nativeElement, {
          rotation: finalRotation + 3,
          duration: 0.2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1,
        });
      },
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

    const banner = this.winnerBanner.nativeElement;
    gsap.set(banner, { opacity: 0, scale: 0.5, y: 50 });
    gsap.to(banner, {
      opacity: 1,
      scale: 1.2,
      y: 0,
      duration: 1,
      ease: 'back.out(1.7)',
    });
    gsap.to(banner, {
      scale: 1,
      duration: 0.4,
      delay: 1,
      ease: 'back.inOut(2)',
    });
    gsap.to(banner, {
      opacity: 0,
      duration: 1,
      delay: 3,
    });
  }
}
