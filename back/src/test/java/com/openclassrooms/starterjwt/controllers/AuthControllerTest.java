package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserRepository userRepository;

    @Test
    public void authenticateUser() {
        Long id = 1L;
        String email = "test@test.com";
        String password = "azerty";
        String firstname = "John";
        String lastname = "Doe";
        boolean isAdmin = false;

        UserDetailsImpl userDetails = UserDetailsImpl
                .builder()
                .username(email)
                .firstName(firstname)
                .lastName(lastname)
                .id(id)
                .password(password)
                .build();

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        when(authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password))).thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt");
        when(userRepository.findByEmail(email)).thenReturn(
                Optional.of(User
                        .builder()
                        .id(id)
                        .email(email)
                        .password(password)
                        .firstName(firstname)
                        .lastName(lastname)
                        .admin(isAdmin)
                        .build()
                )
        );

        AuthController authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils, userRepository);

        final LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        ResponseEntity<?> response = authController.authenticateUser(loginRequest);
        JwtResponse responseBody = (JwtResponse) response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());

        assertEquals(email, responseBody.getUsername());
        assertEquals(firstname, responseBody.getFirstName());
        assertEquals(lastname, responseBody.getLastName());
        assertEquals(id, responseBody.getId());
        assertEquals(isAdmin, responseBody.getAdmin());

        assertEquals("Bearer", responseBody.getType());
        assertNotNull(responseBody.getToken());
    }

    @Test
    public void registerUser() {
        AuthController authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils, userRepository);
        String email = "test@test.com";
        String password = "azerty";
        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(new User());

        final SignupRequest signupReq = new SignupRequest();
        signupReq.setEmail(email);
        signupReq.setFirstName("");
        signupReq.setLastName("");
        signupReq.setPassword(password);

        ResponseEntity<?> response = authController.registerUser(signupReq);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void registerUserEmailAlreadyTaken() {
        AuthController authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils, userRepository);
        String email = "test@test.com";
        String password = "azerty";

        when(userRepository.existsByEmail(email)).thenReturn(true);

        final SignupRequest signupReq = new SignupRequest();
        signupReq.setEmail(email);
        signupReq.setFirstName("");
        signupReq.setLastName("");
        signupReq.setPassword(password);

        ResponseEntity<?> response = authController.registerUser(signupReq);

        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error: Email is already taken!", messageResponse.getMessage());
    }
}