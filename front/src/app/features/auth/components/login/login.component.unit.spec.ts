import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { SessionService } from '../../../../services/session.service';
import { AuthService } from '../../services/auth.service';

import { LoginComponent } from './login.component';

export class MockRouter {
  get url(): string {
      return '';
  }
  navigate(): Promise<boolean> {
      return new Promise<boolean>((resolve, _) => resolve(true));
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let authService: AuthService;
  let router: Router;

  const sessionInfos: SessionInformation = { username: "", firstName: "", lastName: "", id: 0, admin: false, token: "", type: "" };
  const sessionInfos$ = of(sessionInfos);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        SessionService,
        AuthService,
        { provide: Router, useClass: MockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login', () => {
    const authSpy = jest.spyOn(authService, 'login').mockReturnValue(sessionInfos$);
    const sessionSpy = jest.spyOn(sessionService, 'logIn').mockImplementation(() => {});

    component.submit();

    expect(authSpy).toHaveBeenCalledTimes(1);
    expect(sessionSpy).toHaveBeenCalledTimes(1);
  });
});
