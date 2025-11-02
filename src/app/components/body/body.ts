import { Level } from './../level/level';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { PrizesCard } from '../prizes-card/prizes-card';
import confetti from 'canvas-confetti';
@Component({
  selector: 'app-body',
  imports: [ CommonModule, PrizesCard,Level],
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

  ngAfterViewInit() {
    // Initialize component after view is ready
  }

  spinWheel() {
    if (this.isSpinning || this.spinCount <= 0) return;
    this.spinCount--;
    this.isSpinning = true;

    const totalSlices = 6;
    const sliceAngle = 360 / totalSlices;
    const randomIndex = Math.floor(Math.random() * totalSlices);
    const targetAngle = randomIndex * sliceAngle + sliceAngle / 2;
    const finalRotation = 360 * 5 - targetAngle;
    this.rotation = finalRotation;

    // GSAP spinning animation
    gsap.to(this.wheel.nativeElement, {
      rotation: finalRotation,
      duration: 4,
      ease: 'power4.out',
      onComplete: () => {
        this.isSpinning = false;
        const slices = this.wheel.nativeElement.querySelectorAll('.slice');
        const selectedSlice = slices[randomIndex] as HTMLElement;
        const prizeText = selectedSlice.querySelector('span')?.textContent?.trim() || 'Unknown Prize';
        const prizeImg = selectedSlice.querySelector('img')?.getAttribute('src') || '';
        
        this.showWinningAnimation(prizeText, prizeImg);
        this.launchConfetti();
        
        // Small wobble effect after spinning
        gsap.to(this.wheel.nativeElement, {
          rotation: finalRotation + 3,
          duration: 0.2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: 1
        });
      }
    });
  }

  launchConfetti() {
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({ 
        particleCount: 5, 
        angle: 60, 
        spread: 55, 
        origin: { x: 0 } 
      });
      confetti({ 
        particleCount: 5, 
        angle: 120, 
        spread: 55, 
        origin: { x: 1 } 
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }

  showWinningAnimation(prize: string, imgSrc: string) {
    this.winnerText = `YOU WON: ${prize}! 🎉`;
    this.winnerImage = imgSrc;
    
    // GSAP animation for winner banner
    const banner = this.winnerBanner.nativeElement;
    gsap.set(banner, { opacity: 0, scale: 0.5, y: 50 });
    gsap.to(banner, { 
      opacity: 1, 
      scale: 1.2, 
      y: 0, 
      duration: 1, 
      ease: 'back.out(1.7)' 
    });
    gsap.to(banner, { 
      scale: 1, 
      duration: 0.4, 
      delay: 1, 
      ease: 'back.inOut(2)' 
    });
    gsap.to(banner, { 
      opacity: 0, 
      duration: 1, 
      delay: 3, 
      ease: 'power1.out' 
    });
  }
}
