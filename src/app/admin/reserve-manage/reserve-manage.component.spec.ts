import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveManageComponent } from './reserve-manage.component';

describe('ReserveManageComponent', () => {
  let component: ReserveManageComponent;
  let fixture: ComponentFixture<ReserveManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserveManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
