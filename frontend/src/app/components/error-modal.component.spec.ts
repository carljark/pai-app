import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorModalComponent } from './error-modal.component';
import { ComponentRef } from '@angular/core';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;
  let componentRef: ComponentRef<ErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render message input', () => {
    componentRef.setInput('message', 'Test Error Message');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Test Error Message');
  });

  it('should emit close event when button is clicked', () => {
    let emitted = false;
    component.close.subscribe(() => emitted = true);
    
    const button = fixture.nativeElement.querySelector('button');
    button?.click();
    
    expect(emitted).toBe(true);
  });
});
