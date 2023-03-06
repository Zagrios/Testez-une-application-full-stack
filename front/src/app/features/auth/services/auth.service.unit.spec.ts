import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionInformation } from '../../../interfaces/sessionInformation.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockHttp: HttpTestingController;

  const pathService: string = 'api/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    authService = TestBed.inject(AuthService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  })

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should make a POST request to register a user', () => {
    const registerRequest: RegisterRequest = {email: '', firstName: '', lastName: '', password: ''};

    authService.register(registerRequest).subscribe(res => {
        expect(res).toEqual(void 0);
    });

    const request = mockHttp.expectOne(pathService + '/register');
    expect(request.request.method).toBe('POST');
    request.flush(null);
  });

  it('should make a POST request to log in a user', () => {
    const loginResquest: LoginRequest = {email: '', password: ''};
    // @ts-ignore
    const expectedResponse: SessionInformation =  {
        admin: false,
        firstName: '',
        id: 0,
        lastName: '',
        token: '',
        type: '',
        username: ''
    };

    authService.login(loginResquest).subscribe(res => {
        expect(res).toEqual(expectedResponse);
    });

    const request = mockHttp.expectOne(pathService + '/login');
    expect(request.request.method).toBe('POST');
    request.flush(expectedResponse);
  });

});
