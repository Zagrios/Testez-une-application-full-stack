import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';


describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockSessionService: jest.Mocked<SessionService>;

  beforeEach(async () => {

    mockSessionService = {
      $isLogged: jest.fn().mockImplementation(() => of(true)),
      logOut: jest.fn()
    } as unknown as jest.Mocked<SessionService>;

    await TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: mockSessionService},
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create the app', () => {;
    expect(component).toBeTruthy();
  });

  it('should call sessionService.$isLogged on $isLogged', () => {
    component.$isLogged();
    expect(mockSessionService.$isLogged).toHaveBeenCalled();
  });
});
