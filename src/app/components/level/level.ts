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
}
