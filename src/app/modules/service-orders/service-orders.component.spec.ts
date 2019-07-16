import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOrdersComponent } from './service-orders.component';

describe('ServiceOrdersComponent', () => {
  let component: ServiceOrdersComponent;
  let fixture: ComponentFixture<ServiceOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
