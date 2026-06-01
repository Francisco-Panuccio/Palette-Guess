import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromaticModeComponent } from './chromatic-mode.component';

describe('ChromaticModeComponent', () => {
  let component: ChromaticModeComponent;
  let fixture: ComponentFixture<ChromaticModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChromaticModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChromaticModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
