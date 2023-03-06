import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { User } from '../interfaces/user.interface';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let mockHttp: HttpTestingController;

  const pathService = 'api/user';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UserService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a user with the given id', () => {
    const userId = 1;
    const expectedUser: User = {
      id: userId,
      admin: false,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
      email: '',
      password: '',
    };

    service.getById(userId.toString()).subscribe((user: User) => {
      expect(user).toEqual(expectedUser);
    });

    const req = mockHttp.expectOne(`${pathService}/${userId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedUser);
  });

  it('should delete a user with the given id', () => {
    const userId = '1';

    service.delete(userId).subscribe(res => {
      expect(res).toBeNull() // pas de réponse attendue
    });

    const req = mockHttp.expectOne(`${pathService}/${userId}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });
});
