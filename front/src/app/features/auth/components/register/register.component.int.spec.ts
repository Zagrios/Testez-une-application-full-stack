import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {

    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authService: AuthService;
    let controller: HttpTestingController;

    const pathService = 'api/auth';

    let mockRouter = {
        url: '',
        navigate: jest.fn().mockImplementation(async () => true)  
    } as unknown as jest.Mocked<any>

    beforeEach(async () => {

        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            providers:[
                AuthService,
                { provide: Router, useValue: mockRouter},
            ],
            imports: [
                BrowserAnimationsModule,
                HttpClientTestingModule,
                ReactiveFormsModule,  
                MatCardModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;

        authService = TestBed.inject(AuthService);
        controller = TestBed.inject(HttpTestingController);

        fixture.detectChanges();
    
    });

    afterEach(() => {
        controller.verify();
    })

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should register user without error', () => {

        const spyAuthRegister = jest.spyOn(authService, 'register');

        component.submit();

        const registerReq = controller.expectOne(`${pathService}/register`);
        registerReq.flush("User registered successfully");

        expect(spyAuthRegister).toHaveBeenNthCalledWith(1, component.form.value);
        expect(component.onError).toBeFalsy();

    });

    it('should register user with error if the register request fails', () => {

        const spyAuthRegister = jest.spyOn(authService, 'register');

        component.submit();

        const registerReq = controller.expectOne(`${pathService}/register`);
        registerReq.flush('Bad Request', {status: 400, statusText: 'Bad Request'});

        expect(spyAuthRegister).toHaveBeenNthCalledWith(1, component.form.value);
        expect(component.onError).toBeTruthy();

    });

});