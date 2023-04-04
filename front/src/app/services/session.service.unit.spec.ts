import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { lastValueFrom } from 'rxjs';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should update sessionInformation and set isLogged to true', () => {
    const sessionInformation: SessionInformation = {
      admin: false,
      firstName: '',
      id: 0,
      lastName: '',
      token: '',
      type: '',
      username: ''
    };

    service.logIn(sessionInformation);

    expect(service.sessionInformation).toEqual(sessionInformation);
    expect(service.isLogged).toBe(true);
    expect(lastValueFrom(service.$isLogged())).resolves.toBe(true);
  });

  it('should update sessionInformation and isLogged to false', () => {
    service.logOut();

    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
    expect(lastValueFrom(service.$isLogged())).resolves.toBe(false);
  })
});
