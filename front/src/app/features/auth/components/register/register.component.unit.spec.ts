import { HttpClientModule } from '@angular/common/http';
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

  let mockAuthService = {
    register: jest.fn().mockReturnValue(of(undefined))
  } as unknown as jest.Mocked<AuthService>;

  let mockRouter = {
    url: '',
    navigate: jest.fn().mockImplementation(async () => true)  
  } as unknown as jest.Mocked<any>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        { provide: AuthService, useValue: mockAuthService},
        { provide: Router, useValue: mockRouter},
      ],
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,  
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register() and navigate() methods with correct parameters', () => {
    component.form = new FormBuilder().group({email: '', firstName: '', lastName: '', password: ''});
    const formValue = component.form.value;

    component.submit();
    expect(mockAuthService.register).toHaveBeenCalledWith(formValue);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

});
