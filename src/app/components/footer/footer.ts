import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class Footer implements AfterViewInit {

  ngAfterViewInit() {
    const list = document.querySelector('#winnerList');

    if (list) {
      // Create looping GSAP timeline (paused initially)
      const tl = gsap.timeline({ repeat: -1, ease: 'power1.inOut', repeatDelay: 0 });

      // Define motion cycle
      tl.to(list, { y: '-90%', duration: 5 })
        .to(list, { y: '0%', duration: 5 })   // 🔹 center
        .to(list, { y: '90%', duration: 5 })
        .to(list, { y: '0%', duration: 5 });  // 🔹 center again

      // ✅ Force center & pause when hovered
      list.addEventListener('mouseenter', () => {
        // Move smoothly to center
        gsap.to(list, { y: '0%', duration: 0.5, ease: 'power1.out' });
        // Pause timeline
        tl.pause();
      });

      // ✅ Restart from center when hover ends
      list.addEventListener('mouseleave', () => {
        // Reset position to center
        gsap.set(list, { y: '0%' });
        // Restart animation from the center phase
        tl.restart();
      });
    }
  }
}
