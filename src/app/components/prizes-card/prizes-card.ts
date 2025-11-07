import { Component, Input, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-prizes-card',
  standalone: true,
  imports: [],
  templateUrl: './prizes-card.html',
  styleUrl: './prizes-card.css',
})
export class PrizesCard implements AfterViewInit {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() image: string = '';
  @Input() titleImage: string = '';
  @Input() subtitleImage: string = '';
  @Input() titleAlt: string = '';
  @Input() subtitleAlt: string = '';
  @Input() variant: 'minor' | 'major' | 'grand' | '' = '';
  @Input() active: boolean = false; // programmatic active hover state
  @Output() picked = new EventEmitter<'minor' | 'major' | 'grand'>();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const elements = {
      card: this.el.nativeElement.querySelector('div'),
      image: this.el.nativeElement.querySelector('.wheel-img'),
    };

    const parsedTitle = this.title.toLowerCase();
    const effectiveVariant: 'minor' | 'major' | 'grand' | '' = this.variant || (parsedTitle.includes('minor') ? 'minor' : parsedTitle.includes('major') ? 'major' : parsedTitle.includes('grand') ? 'grand' : '');

    // Variant-specific glow colors (minor yellow, major red, grand blue)
    const glowColor =
      effectiveVariant === 'minor'
        ? '#FFD700' // yellow
        : effectiveVariant === 'major'
        ? '#FF2D2D' // red
        : effectiveVariant === 'grand'
        ? '#009DFF' // blue
        : '#FFD700';

    const animations = {
      enter: {
        image: {
          rotation: 360,
          scale: 1.15,
          filter: `grayscale(0%) drop-shadow(0 0 40px ${glowColor})`,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
        },
        card: {
          borderColor: glowColor,
          boxShadow: `0 0 25px 6px ${glowColor}`,
        },
        titleImg: {
          filter: `grayscale(0%) drop-shadow(0 0 12px ${glowColor})`,
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.out',
        },
        subtitleImg: {
          filter: `grayscale(0%) drop-shadow(0 0 8px ${glowColor})`,
          scale: 1.03,
          duration: 0.4,
          ease: 'power2.out',
        },
      },
      leave: {
        image: {
          rotation: -50, 
          scale: 1,
          filter: 'grayscale(100%) drop-shadow(0 0 0 transparent)',
          duration: 0.4,
          ease: 'power2.inOut',
        },
        card: {
          borderColor: 'transparent',
          boxShadow: 'none',
        },
        titleImg: {
          filter: 'grayscale(100%) drop-shadow(0 0 0 transparent)',
          scale: 1,
        },
        subtitleImg: {
          filter: 'grayscale(100%) drop-shadow(0 0 0 transparent)',
          scale: 1,
        },
      },
    };

    const animate = (el: HTMLElement, props: Record<string, any>) => {
      gsap.killTweensOf(el); 
      gsap.to(el, { overwrite: 'auto', ...props });
    };

    const titleImgEl = this.el.nativeElement.querySelector('.title-img');
    const subtitleImgEl = this.el.nativeElement.querySelector('.subtitle-img');

    elements.card.addEventListener('mouseenter', () => {
      animate(elements.image, animations.enter.image);
      animate(elements.card, animations.enter.card);
      if (titleImgEl) animate(titleImgEl, animations.enter.titleImg);
      if (subtitleImgEl) animate(subtitleImgEl, animations.enter.subtitleImg);
      if (effectiveVariant) this.picked.emit(effectiveVariant);
    });

    elements.card.addEventListener('mouseleave', () => {
      animate(elements.image, animations.leave.image);
      animate(elements.card, animations.leave.card);
      if (titleImgEl) animate(titleImgEl, animations.leave.titleImg);
      if (subtitleImgEl) animate(subtitleImgEl, animations.leave.subtitleImg);
    });

    // Default active on load
    if (this.active) {
      // Emit variant to parent to sync wheel appearance
      if (effectiveVariant) this.picked.emit(effectiveVariant);
      // Run hover animations once
      setTimeout(() => {
        animate(elements.image, animations.enter.image);
        animate(elements.card, animations.enter.card);
        if (titleImgEl) animate(titleImgEl, animations.enter.titleImg);
        if (subtitleImgEl) animate(subtitleImgEl, animations.enter.subtitleImg);
      }, 0);
    }
  }
}
