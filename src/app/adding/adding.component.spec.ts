import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingComponent } from './adding.component';

describe('AddingComponent', () => {
  let component: AddingComponent;
  let fixture: ComponentFixture<AddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
