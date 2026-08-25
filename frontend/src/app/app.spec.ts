import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) }
        }
      ]
    }).compileComponents();
  });

  it('should create the app component correctly', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
