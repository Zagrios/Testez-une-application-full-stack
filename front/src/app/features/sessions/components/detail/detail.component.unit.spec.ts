import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals'; 
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';

import { DetailComponent } from './detail.component';


describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  let mockRouter: jest.Mocked<Router>;
  let mockMatSnakBar: jest.Mocked<MatSnackBar>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockMatSnakBar = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    mockSessionApiService = {
      delete: jest.fn(),
      participate: jest.fn(),
      unParticipate: jest.fn(),
      detail: jest.fn().mockImplementation(() => of({users: [0], teacher_id: 444} as Session)),
    } as unknown as jest.Mocked<SessionApiService>;

    mockTeacherService = {
      detail: jest.fn(),
    } as unknown as jest.Mocked<TeacherService>;

    mockSessionService = {
      sessionInformation: {
        id: 1,
        admin: true,
      },
    } as unknown as jest.Mocked<SessionService>;

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'),
        },
      },
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule
      ],
      declarations: [DetailComponent], 
      providers: [
        FormBuilder,
        { provide: MatSnackBar, useValue: mockMatSnakBar },
        { provide: Router, useValue: mockRouter },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);

    component = fixture.componentInstance;
    component.sessionId = "123"
    component.userId = "456";

    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchSession on init', () => {
    // @ts-ignore : private method
    const fetchSessionSpy = jest.spyOn(component, 'fetchSession');
    component.ngOnInit();
    expect(fetchSessionSpy).toHaveBeenCalled();
  });

  it('should navigate to sessions and show snackbar when delete is called', () => {
    mockSessionApiService.delete.mockReturnValue(of({}));
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith('123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    expect(mockMatSnakBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', {
      duration: 3000,
    });
  });

  it('should call participate and fetchSession when participate is called', () => {
    mockSessionApiService.participate.mockReturnValue(of(void 0));
    // @ts-ignore : private method
    const fetchSessionSpy = jest.spyOn(component, 'fetchSession');
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalledWith('123', '456');
    expect(fetchSessionSpy).toHaveBeenCalled();
  });

  it('should call unParticipate and fetchSession when unParticipate is called', () => {
    mockSessionApiService.unParticipate.mockReturnValue(of(void 0));
    // @ts-ignore : private method
    const fetchSessionSpy = jest.spyOn(component, 'fetchSession');
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('123', '456');
    expect(fetchSessionSpy).toHaveBeenCalled();
  });

  it('should call back', () => {
    const backSpy = jest.spyOn(component, 'back');
    component.back();
    expect(backSpy).toHaveBeenCalled();
  });


});

