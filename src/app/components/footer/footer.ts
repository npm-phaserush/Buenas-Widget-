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
