import { Component, AfterViewInit, Input } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer implements AfterViewInit {
  @Input() variant: 'minor' | 'major' | 'grand' = 'minor';

  getJackpotAmount(): string {
    switch (this.variant) {
      case 'major': return '₱198,765,432'; // higher than minor
      case 'grand': return '₱298,765,432'; // highest
      case 'minor':
      default: return '₱98,765,432';
    }
  }

  getJackpotGlow(): string {
    switch (this.variant) {
      case 'major': return '0 0 18px rgba(255,60,60,0.6), 0 0 30px rgba(255,0,0,0.4)';
      case 'grand': return '0 0 18px rgba(80,170,255,0.7), 0 0 30px rgba(0,110,200,0.5)';
      case 'minor':
      default: return '0 0 15px rgba(255,204,51,0.2), 0 0 25px rgba(0,0,0,0.8)';
    }
  }

  ngAfterViewInit() {
    const list = document.querySelector('#winnerList');

    if (list) {
      const tl = gsap.timeline({ repeat: -1, ease: 'power1.inOut', repeatDelay: 0 });

      //  motion cycle
      tl.to(list, { y: '-90%', duration: 5 })
        .to(list, { y: '0%', duration: 5 }) 
        .to(list, { y: '90%', duration: 5 })
        .to(list, { y: '0%', duration: 5 });

      
      list.addEventListener('mouseenter', () => {
        gsap.to(list, { y: '0%', duration: 0.5, ease: 'power1.out' });
        tl.pause();
      });

      list.addEventListener('mouseleave', () => {
        gsap.set(list, { y: '0%' });
        tl.restart();
      });
    }
  }
}
