import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareadminComponent } from './careadmin.component';

describe('CareadminComponent', () => {
  let component: CareadminComponent;
  let fixture: ComponentFixture<CareadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
