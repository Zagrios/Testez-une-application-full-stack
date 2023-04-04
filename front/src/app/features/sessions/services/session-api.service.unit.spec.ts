import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Session } from '../interfaces/session.interface';

import { SessionApiService } from './session-api.service';

describe('SessionsService', () => {
  let service: SessionApiService;
  let mockHttp: HttpTestingController;

  const pathService = 'api/session';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(SessionApiService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    mockHttp.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should make a GET request to the session API and return an array of sessions', () => {
      const mockSessions: Session[] = [
        { id: 1, name: 'Session 1', date: new Date(), description: 'Description 1', teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() },
      ];

      service.all().subscribe((sessions) => {
        expect(sessions).toEqual(mockSessions);
      });

      const req = mockHttp.expectOne(pathService);
      expect(req.request.method).toEqual('GET');
      req.flush(mockSessions);
    });
  });

  describe('detail', () => {
    it('should make a GET request to the session API with the specified ID and return the session', () => {
      const id = 1;
      const mockSession: Session = { id, name: 'Session 1', date: new Date(), description: 'Description 1', teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() };

      service.detail(id.toString()).subscribe((session) => {
        expect(session).toEqual(mockSession);
      });

      const req = mockHttp.expectOne(`api/session/${id}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockSession);
    });
  });

  describe('delete', () => {
    it('should make a DELETE request to the session API with the specified ID and return nothing', () => {
      const id = '1';

      service.delete(id).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = mockHttp.expectOne(`api/session/${id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(null);
    });
  });

  describe('create', () => {
    it('should make a POST request to the session API with the specified session and return the created session', () => {
      const mockSession: Session = { id: 1, name: 'Session 1', date: new Date(), description: 'Description 1', teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() };

      service.create(mockSession).subscribe((session) => {
        expect(session).toEqual(mockSession);
      });

      const req = mockHttp.expectOne('api/session');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(mockSession);
      req.flush(mockSession);
    });
  });

  describe('update', () => {
    it('should make a PUT request to the session API with the specified ID and session and return the updated session', () => {
      const id = 1;
      const mockSession: Session = { id, name: 'Session 1', date: new Date(), description: 'Description 1', teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() };
      

      service.update(id.toString(), mockSession).subscribe((session) => {
        expect(session).toEqual(mockSession);
      });

      const req = mockHttp.expectOne(`api/session/${id}`);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(mockSession);
      req.flush(mockSession);
    });
  });

  describe('participate', () => {
    it('should allow user to participate in session', () => {
      service.participate('1', 'user1').subscribe((session) => {
        expect(session).toBeNull();
      });

      const req = mockHttp.expectOne(`${pathService}/1/participate/user1`);
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    });
  });

  describe('unParticipate', () => {
    it('should allow user to unparticipate in session', () => {
      service.unParticipate('1', 'user1').subscribe((session) => {
        expect(session).toBeNull();
      });

      const req = mockHttp.expectOne(`${pathService}/1/participate/user1`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(null);
    })
  })


});
