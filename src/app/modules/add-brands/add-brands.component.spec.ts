import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrandsComponent } from './add-brands.component';

describe('AddBrandsComponent', () => {
  let component: AddBrandsComponent;
  let fixture: ComponentFixture<AddBrandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
