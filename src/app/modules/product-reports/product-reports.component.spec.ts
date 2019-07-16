import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReportsComponent } from './product-reports.component';

describe('ProductReportsComponent', () => {
  let component: ProductReportsComponent;
  let fixture: ComponentFixture<ProductReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
