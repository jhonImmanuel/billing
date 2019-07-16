import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallServiceListComponent } from './overall-service-list.component';

describe('OverallServiceListComponent', () => {
  let component: OverallServiceListComponent;
  let fixture: ComponentFixture<OverallServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
