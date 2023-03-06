import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { MeComponent } from './me.component';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../interfaces/user.interface';
import { SessionInformation } from '../../interfaces/sessionInformation.interface';

describe('MeComponent', () => {

  const mockSession: SessionInformation = { admin: false, firstName: '', id: 0, lastName: '', token: '', username: '', type: '' };
  const user: User = {id: 1, admin: false, createdAt: new Date(), updatedAt: new Date(), firstName: '', lastName: '', password: '', email: ''};

  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockUserService: jest.Mocked<UserService>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;
  let mockRouter: jest.MockedObject<any>;

    mockRouter = {
      url: '',
      navigate: jest.fn().mockImplementation(async () => true)  
    } as unknown as jest.Mocked<any>

    mockUserService = {
      getById: jest.fn().mockReturnValue(of(user)),
      delete: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<UserService>;

    mockSessionService = {
      sessionInformation: mockSession,
      logOut: jest.fn().mockImplementation(() => {})
    } as unknown as jest.Mocked<SessionService>;

    mockMatSnackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        RouterTestingModule,
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        {provide: SessionService, useValue: mockSessionService},
        {provide: UserService, useValue: mockUserService},
        {provide: MatSnackBar, useValue: mockMatSnackBar},
        {provide: Router, useValue: mockRouter}
      ],
    }).compileComponents();


    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call userService.getById', () => {

      component.ngOnInit();

      expect(mockUserService.getById).toHaveBeenCalledWith(mockSession.id.toString());
      expect(component.user).toEqual(user);
    });
  });

  describe('back', () => {
    it('should call window.history.back', () => {
      const spy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
      component.back();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('delete', () => {

    it('should call UserService.delete() and logOut() and navigate() methods with correct parameters', () => {
      const spyLogOut = jest.spyOn(mockSessionService, 'logOut').mockImplementation(() => {});
      const spyNavigate = jest.spyOn(mockRouter, 'navigate');

      component.delete();

      expect(mockUserService.delete).toHaveBeenCalledWith(mockSession.id.toString());
      expect(mockMatSnackBar.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
      expect(spyLogOut).toHaveBeenCalled();
      expect(spyNavigate).toHaveBeenCalledWith(['/']);
    });

  });
});
