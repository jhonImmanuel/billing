import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriesListComponent } from './accessories-list.component';

describe('AccessoriesListComponent', () => {
  let component: AccessoriesListComponent;
  let fixture: ComponentFixture<AccessoriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessoriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
