import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoaderComponent } from './skeleton-loader.component';

describe('SkeletonLoaderComponent', () => {
  let fixture: ComponentFixture<SkeletonLoaderComponent>;
  let component: SkeletonLoaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 4 skeleton lines by default', () => {
    const lines = fixture.nativeElement.querySelectorAll('.skeleton-line');
    expect(lines.length).toBe(4);
  });

  it('should render the correct number of lines when `lines` input is set', () => {
    fixture.componentRef.setInput('lines', 7);
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.skeleton-line');
    expect(lines.length).toBe(7);
  });

  it('should NOT render the text paragraph when text is empty', () => {
    const p = fixture.nativeElement.querySelector('.skeleton-text');
    expect(p).toBeNull();
  });

  it('should render the text paragraph when `text` input is provided', () => {
    fixture.componentRef.setInput('text', 'Carregant dades...');
    fixture.detectChanges();
    const p = fixture.nativeElement.querySelector('.skeleton-text');
    expect(p).not.toBeNull();
    expect(p.textContent.trim()).toBe('Carregant dades...');
  });

  it('should set aria-label from text input', () => {
    fixture.componentRef.setInput('text', 'Cargando datos...');
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('.skeleton-wrapper');
    expect(wrapper.getAttribute('aria-label')).toBe('Cargando datos...');
  });

  it('should use default aria-label when no text is provided', () => {
    const wrapper = fixture.nativeElement.querySelector('.skeleton-wrapper');
    expect(wrapper.getAttribute('aria-label')).toBe('Carregant...');
  });

  it('lineArray should return an array of the given length', () => {
    fixture.componentRef.setInput('lines', 3);
    expect(component.lineArray.length).toBe(3);
  });
});
