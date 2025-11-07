import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-level',
  standalone: true,
  imports: [],
  templateUrl: './level.html',
  styleUrls: ['./level.css'],
})
export class Level {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() variant: 'minor' | 'major' | 'grand' = 'minor';

  getVipNumber(): string {
    switch (this.variant) {
      case 'major': return 'VIP 20';
      case 'grand': return 'VIP 30';
      case 'minor':
      default: return 'VIP 10';
    }
  }

  getBorderGradient(): string {
    switch (this.variant) {
      case 'major': return 'linear-gradient(to right, #ff4d4d, #cc0000)';
      case 'grand': return 'linear-gradient(to right, #66ccff, #0066cc)';
      case 'minor':
      default: return 'linear-gradient(to right, #ffb800, #ff9900)';
    }
  }

  getGlowShadow(): string {
    switch (this.variant) {
      case 'major': return '0 0 18px rgba(255,60,60,0.7)';
      case 'grand': return '0 0 18px rgba(80,170,255,0.7)';
      case 'minor':
      default: return '0 0 15px rgba(255,179,0,0.4)';
    }
  }

  getVipColor(): string {
    switch (this.variant) {
      case 'major': return '#ff4d4d';
      case 'grand': return '#2da8ff';
      case 'minor':
      default: return '#ffb800';
    }
  }
}
