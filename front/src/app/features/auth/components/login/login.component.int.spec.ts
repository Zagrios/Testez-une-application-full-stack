import { HttpClient, HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { SessionInformation } from "../../../../interfaces/sessionInformation.interface";
import { SessionService } from "../../../../services/session.service";
import { AuthService } from "../../services/auth.service";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {

    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: AuthService;
    let sessionService: SessionService;
    let controller: HttpTestingController

    const pathService = 'api/auth';

    const sessionInfos: SessionInformation = { username: "", firstName: "", lastName: "", id: 0, admin: false, token: "", type: "" };

    const mockRouter = {
        navigate: jest.fn().mockImplementation(async () => true)  
    } as unknown as jest.Mocked<any>

    beforeEach(async () => {
    
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [
                AuthService,
                SessionService,
                { provide: Router, useValue: mockRouter },
            ],
            imports: [
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                MatCardModule,
                MatIconModule,
                MatFormFieldModule,
                MatInputModule,
                ReactiveFormsModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;

        authService = TestBed.inject(AuthService);
        sessionService = TestBed.inject(SessionService);
        controller = TestBed.inject(HttpTestingController);

        fixture.detectChanges();

    });

    afterEach(() => {
        controller.verify();
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should login without any errors', () => {

        const authLoginSpy = jest.spyOn(authService, 'login');
        const sessionLoginSpy = jest.spyOn(sessionService, 'logIn');

        component.submit();

        const submitReq = controller.expectOne(`${pathService}/login`);
        submitReq.flush(sessionInfos);

        expect(authLoginSpy).toHaveBeenNthCalledWith(1, component.form.value);
        expect(sessionLoginSpy).toHaveBeenNthCalledWith(1, sessionInfos);

        expect(component.onError).toBeFalsy();
        expect(sessionService.isLogged).toBeTruthy();
        expect(sessionService.sessionInformation).toEqual(sessionInfos);

    });

    it('should set onError to true if login request not succeed', () => {
            
            const authLoginSpy = jest.spyOn(authService, 'login');
            const sessionLoginSpy = jest.spyOn(sessionService, 'logIn');
    
            component.submit();
    
            const submitReq = controller.expectOne(`${pathService}/login`);
            submitReq.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    
            expect(authLoginSpy).toHaveBeenNthCalledWith(1, component.form.value);
            expect(sessionLoginSpy).not.toHaveBeenCalled();
    
            expect(component.onError).toBeTruthy();
            expect(sessionService.isLogged).toBeFalsy();
            
    });

});