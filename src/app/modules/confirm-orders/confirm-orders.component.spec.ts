import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmOrdersComponent } from './confirm-orders.component';

describe('ConfirmOrdersComponent', () => {
  let component: ConfirmOrdersComponent;
  let fixture: ComponentFixture<ConfirmOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
