import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizesCard } from './prizes-card';

describe('PrizesCard', () => {
  let component: PrizesCard;
  let fixture: ComponentFixture<PrizesCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizesCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrizesCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
