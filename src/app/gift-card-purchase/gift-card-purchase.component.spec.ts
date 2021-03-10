import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardPurchaseComponent } from './gift-card-purchase.component';

describe('GiftCardPurchaseComponent', () => {
  let component: GiftCardPurchaseComponent;
  let fixture: ComponentFixture<GiftCardPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftCardPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
