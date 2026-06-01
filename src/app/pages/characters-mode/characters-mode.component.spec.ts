import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharactersModeComponent } from './characters-mode.component';

describe('CharactersModeComponent', () => {
  let component: CharactersModeComponent;
  let fixture: ComponentFixture<CharactersModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharactersModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
