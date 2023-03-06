import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { Observable, of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { SessionInformation } from '../../../../interfaces/sessionInformation.interface';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';

describe('FormComponent', () => {

  const sessionInfos: SessionInformation = { username: "", firstName: "", lastName: "", id: 1, admin: true, token: "", type: "" };

  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  let mockSessionService: jest.Mocked<SessionService>;
  let mockRouter: jest.Mocked<any>;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;



  beforeEach(async () => {

    mockSessionService = {
      sessionInformation: sessionInfos
    } as unknown as jest.Mocked<SessionService>;
  
    mockRouter = {
      url: '',
      navigate: jest.fn().mockImplementation(async () => true),
    } as unknown as jest.Mocked<any>;
  
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1'),
        },
      }
    } as unknown as jest.Mocked<ActivatedRoute>;
  
    mockMatSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;
  
    mockSessionApiService = {
      detail: jest.fn().mockImplementation(() => of({id: 1, name: 'Session'})),
      create: jest.fn().mockImplementation(() => of({ id: 1, name: 'Test Session'})),
      update: jest.fn().mockImplementation(() => of({ id: 1, name: 'Updated Test Session'})),
    } as unknown as jest.Mocked<SessionApiService>;

    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule, 
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if user is not admin', () => {
    mockSessionService.sessionInformation = {...sessionInfos, admin: false};
    component.ngOnInit();
    const spy = jest.spyOn(mockRouter, 'navigate');
    expect(spy).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onUpdate to true and initialize form if url contains "update"', () => {
    mockRouter.url = '/sessions/update/1';
    component.ngOnInit();
    expect(component.onUpdate).toBe(true);
    const spyGet = jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get');
    expect(spyGet).toHaveBeenCalledWith('id');
    const spyDetail = jest.spyOn(mockSessionApiService, 'detail');
    expect(spyDetail).toHaveBeenCalledWith('1');
    expect(component.sessionForm?.get('name')?.value).toBe('');
    expect(component.sessionForm?.get('date')?.value).toBe('');
    expect(component.sessionForm?.get('teacher_id')?.value).toBe('');
    expect(component.sessionForm?.get('description')?.value).toBe('');
  });

  it('should initialize form if url does not contain "update"', () => {
    component.ngOnInit();
    expect(component.onUpdate).toBe(false);
    const getSpy = jest.spyOn(mockActivatedRoute.snapshot.paramMap, 'get');
    expect(getSpy).not.toHaveBeenCalled();
    const detailSpy = jest.spyOn(mockSessionApiService, 'detail');
    expect(detailSpy).not.toHaveBeenCalled();
    expect(component.sessionForm?.get('name')?.value).toBe('');
    expect(component.sessionForm?.get('date')?.value).toBe('');
    expect(component.sessionForm?.get('teacher_id')?.value).toBe('');
    expect(component.sessionForm?.get('description')?.value).toBe('');
  });

  it('should call submit and exit page with "Session created !"', () => {
    component.sessionForm = new FormGroup({})
    component.onUpdate = false;

    const spyCreate = jest.spyOn(mockSessionApiService, 'create');
    // @ts-ignore
    const spyOpen = jest.spyOn(component, 'exitPage');

    component.submit();

    expect(spyCreate).toHaveBeenCalledWith(component.sessionForm.value);
    expect(spyOpen).toHaveBeenCalledWith('Session created !');
  });

  it('should call submit and exit page with "Session updated !"', () => {
    component.sessionForm = new FormGroup({})
    component.onUpdate = true;

    const spyUpdate = jest.spyOn(mockSessionApiService, 'update');
    // @ts-ignore
    const spyOpen = jest.spyOn(component, 'exitPage');

    component.submit();

    expect(spyUpdate).toHaveBeenCalledWith(undefined, component.sessionForm.value);
    expect(spyOpen).toHaveBeenCalledWith('Session updated !');
  });

  it('should call exitPage', () => {
    const spy = jest.spyOn(mockRouter, 'navigate');
    // @ts-ignore
    component.exitPage('Test');
    expect(spy).toHaveBeenCalledWith(['sessions']);
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Test', 'Close', { duration: 3000 });
  });

});
