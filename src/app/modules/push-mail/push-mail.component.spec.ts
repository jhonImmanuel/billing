import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PushMailComponent } from './push-mail.component';

describe('PushMailComponent', () => {
  let component: PushMailComponent;
  let fixture: ComponentFixture<PushMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PushMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PushMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
