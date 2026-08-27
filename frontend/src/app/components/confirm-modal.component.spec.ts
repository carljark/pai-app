import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';
import { ComponentRef } from '@angular/core';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;
  let componentRef: ComponentRef<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default inputs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('¿Estás seguro?');
    expect(compiled.querySelector('p')?.textContent).toContain('Esta acción no se puede deshacer.');
  });

  it('should reflect input changes', () => {
    componentRef.setInput('title', 'Custom Title');
    componentRef.setInput('message', 'Custom Message');
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Custom Title');
    expect(compiled.querySelector('p')?.textContent).toContain('Custom Message');
  });

  it('should emit confirm event when confirm button is clicked', () => {
    let emitted = false;
    component.confirm.subscribe(() => emitted = true);
    
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const confirmBtn = Array.from(buttons).find((b: any) => b.textContent.includes('Sí, eliminar')) as HTMLElement;
    confirmBtn?.click();
    
    expect(emitted).toBe(true);
  });

  it('should emit cancel event when cancel button is clicked', () => {
    let emitted = false;
    component.cancel.subscribe(() => emitted = true);
    
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const cancelBtn = Array.from(buttons).find((b: any) => b.textContent.includes('Cancelar')) as HTMLElement;
    cancelBtn?.click();
    
    expect(emitted).toBe(true);
  });
});
