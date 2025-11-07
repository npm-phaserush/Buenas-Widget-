import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
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
  // New direct image inputs (optional fallbacks to legacy title/subtitle)
  @Input() titleImage: string = '';
  @Input() subtitleImage: string = '';
  @Input() titleAlt: string = '';
  @Input() subtitleAlt: string = '';
  // Variant drives glow color directly (minor | major | grand)
  @Input() variant: 'minor' | 'major' | 'grand' | '' = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const elements = {
      card: this.el.nativeElement.querySelector('div'),
      image: this.el.nativeElement.querySelector('.wheel-img'),
      title: this.el.nativeElement.querySelector('h3'),
      subtitle: this.el.nativeElement.querySelector('p'),
    };

    // Determine glow color: prefer explicit variant; fallback to legacy title parsing.
    const parsedTitle = this.title.toLowerCase();
    const effectiveVariant = this.variant || (parsedTitle.includes('minor') ? 'minor' : parsedTitle.includes('major') ? 'major' : parsedTitle.includes('grand') ? 'grand' : '');
    const glowColor =
      effectiveVariant === 'minor'
        ? '#FF0000'
        : effectiveVariant === 'major'
        ? '#FFD700'
        : effectiveVariant === 'grand'
        ? '#009DFF'
        : '#FFD700'; // default fallback

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
        // Title/subtitle image hover (apply same glow to both small images)
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
          rotation: -50, // ✅ Always go back to -50 degrees
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

    // ✅ Always kill old tweens before starting a new one
    const animate = (el: HTMLElement, props: Record<string, any>) => {
      gsap.killTweensOf(el); // stop ongoing animations instantly
      gsap.to(el, { overwrite: 'auto', ...props });
    };

    const titleImgEl = this.el.nativeElement.querySelector('.title-img');
    const subtitleImgEl = this.el.nativeElement.querySelector('.subtitle-img');

    elements.card.addEventListener('mouseenter', () => {
      animate(elements.image, animations.enter.image);
      animate(elements.card, animations.enter.card);
      if (titleImgEl) animate(titleImgEl, animations.enter.titleImg);
      if (subtitleImgEl) animate(subtitleImgEl, animations.enter.subtitleImg);
    });

    elements.card.addEventListener('mouseleave', () => {
      animate(elements.image, animations.leave.image);
      animate(elements.card, animations.leave.card);
      if (titleImgEl) animate(titleImgEl, animations.leave.titleImg);
      if (subtitleImgEl) animate(subtitleImgEl, animations.leave.subtitleImg);
    });
  }
}
