import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateImeiComponent } from './generate-imei.component';

describe('GenerateImeiComponent', () => {
  let component: GenerateImeiComponent;
  let fixture: ComponentFixture<GenerateImeiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateImeiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateImeiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
