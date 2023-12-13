import { TestBed } from '@angular/core/testing';
import { AppLogin } from './app.component';

describe('AppLogin', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLogin],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppLogin);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Flowww' title`, () => {
    const fixture = TestBed.createComponent(AppLogin);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Flowww');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppLogin);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, Flowww');
  });
});
