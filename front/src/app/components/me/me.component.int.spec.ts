import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { SessionInformation } from "../../interfaces/sessionInformation.interface";
import { User } from "../../interfaces/user.interface";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";
import { MeComponent } from "./me.component"

describe("MeComponent", () => {

    let component: MeComponent;
    let fixture: ComponentFixture<MeComponent>;
    let userService: UserService;
    let sessionService: SessionService;
    let controller: HttpTestingController;

    const mockMatSnackBar = {
        open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    const mockRouter = {
        navigate: jest.fn().mockImplementation(async () => true)  
    } as unknown as jest.Mocked<any>

    const pathService = 'api/user'

    const fakeSession: SessionInformation = {
        token: '',
        admin: false,
        firstName: '',
        id: 0,
        lastName: '',
        type: '',
        username: ''
    }

    const fakeUser: User = {
        id: fakeSession.id,
        admin: fakeSession.admin,
        firstName: fakeSession.firstName,
        lastName: fakeSession.lastName,
        createdAt: new Date(),
        email: '',
        password: ''
    }

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            declarations: [MeComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                MatSnackBarModule,
                MatCardModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule
            ],
            providers: [
                UserService,
                SessionService,
                { provide: MatSnackBar, useValue: mockMatSnackBar },
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MeComponent);
        component = fixture.componentInstance;
        sessionService = TestBed.inject(SessionService);
        userService = TestBed.inject(UserService);
        controller = TestBed.inject(HttpTestingController);

        sessionService.logIn(fakeSession);

        fixture.detectChanges();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should delete user', () => {
        
        expect(sessionService.isLogged).toEqual(true);
        expect(sessionService.sessionInformation).toEqual(fakeSession);

        const spyLogout = jest.spyOn(sessionService, 'logOut');
        const spyDelete = jest.spyOn(userService, 'delete');

        component.delete();

        const reqs = controller.match(`${pathService}/${fakeSession.id}`);
        expect(reqs.length).toEqual(2);
        const [loginReq, deleteReq] = reqs;

        loginReq.flush(fakeUser);
        deleteReq.flush("user deleted");

        expect(spyDelete).toHaveBeenNthCalledWith(1, fakeSession.id.toString());
        expect(spyLogout).toHaveBeenCalledTimes(1);

        expect(component.user).toEqual(fakeUser);
        expect(sessionService.isLogged).toBeFalsy();

    });

})