import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spinwheel } from './spinwheel';

describe('Spinwheel', () => {
  let component: Spinwheel;
  let fixture: ComponentFixture<Spinwheel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinwheel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spinwheel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
