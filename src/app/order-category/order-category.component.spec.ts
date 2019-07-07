import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCategoryComponent } from './order-category.component';

describe('OrderCategoryComponent', () => {
  let component: OrderCategoryComponent;
  let fixture: ComponentFixture<OrderCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
