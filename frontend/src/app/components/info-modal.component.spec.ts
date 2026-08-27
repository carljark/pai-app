import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoModalComponent } from './info-modal.component';
import { ComponentRef } from '@angular/core';

describe('InfoModalComponent', () => {
  let component: InfoModalComponent;
  let fixture: ComponentFixture<InfoModalComponent>;
  let componentRef: ComponentRef<InfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default title and message for info type', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Información');
    
    componentRef.setInput('message', 'Test Info Message');
    fixture.detectChanges();
    expect(compiled.querySelector('p')?.textContent).toContain('Test Info Message');
  });

  it('should render success type styling and svg when type is success', () => {
    componentRef.setInput('type', 'success');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const p = compiled.querySelector('p');
    expect(compiled.innerHTML).toContain('<svg');
  });

  it('should render info type styling and svg when type is info', () => {
    componentRef.setInput('type', 'info');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const p = compiled.querySelector('p');
    expect(compiled.innerHTML).toContain('<svg');
  });

  it('should emit close event when button is clicked', () => {
    let emitted = false;
    component.close.subscribe(() => emitted = true);
    
    const button = fixture.nativeElement.querySelector('button');
    button?.click();
    
    expect(emitted).toBe(true);
  });
});
