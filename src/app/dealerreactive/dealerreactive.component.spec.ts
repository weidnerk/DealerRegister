import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerReactiveComponent } from './dealerreactive.component';

describe('DealerreactiveComponent', () => {
  let component: DealerReactiveComponent;
  let fixture: ComponentFixture<DealerReactiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerReactiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
