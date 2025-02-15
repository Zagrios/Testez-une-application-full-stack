package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class UserControllerTest {
    @Mock
    private UserMapper userMapper;
    @Mock
    private UserService userService;

    @Test
    public void testFindById() {
        Long id = 1L;
        String email = "test@test.com";
        String firstname = "John";
        String lastname = "Doe";
        boolean admin = false;
        String password = "azerty";

        User user = User.builder()
                .id(id)
                .email(email)
                .firstName(firstname)
                .lastName(lastname)
                .password(password)
                .admin(admin).build();

        UserDto dto = new UserDto();
        dto.setId(id);
        dto.setEmail(email);
        dto.setFirstName(firstname);
        dto.setLastName(lastname);
        dto.setPassword(password);
        dto.setAdmin(admin);

        when(userService.findById(id)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(dto);

        UserController userController = new UserController(userService, userMapper);
        ResponseEntity<?> response = userController.findById(id.toString());
        UserDto responseBody = (UserDto) response.getBody();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, responseBody);
    }

    @Test
    public void testFindByIdNotFound() {
        Long id = 1L;

        when(userService.findById(id)).thenReturn(null);

        UserController userController = new UserController(userService, userMapper);
        ResponseEntity<?> response = userController.findById(id.toString());

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testFindByIdBadRequest() {
        UserController userController = new UserController(userService, userMapper);
        ResponseEntity<?> response = userController.findById("");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void testDelete() {
        Long id = 1L;
        String email = "test@test.com";
        String firstname = "John";
        String lastname = "Doe";
        boolean admin = false;
        String password = "azerty";

        User user = User.builder()
                .id(id)
                .email(email)
                .firstName(firstname)
                .lastName(lastname)
                .password(password)
                .admin(admin).build();

        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(id)
                .username(email)
                .firstName(firstname)
                .lastName(lastname)
                .password(password)
                .admin(admin).build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        when(userService.findById(id)).thenReturn(user);

        SecurityContext securityContext = mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        doNothing().when(userService).delete(id);

        UserController userController = new UserController(userService, userMapper);
        ResponseEntity<?> response = userController.save(id.toString());

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    public void testDeleteNotFound() {
        Long id = 1L;

        when(userService.findById(id)).thenReturn(null);

        UserController userController = new UserController(userService, userMapper);
        ResponseEntity<?> response = userController.save(id.toString());

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void testDeleteBadRequest() {
        UserController userController = new UserController(userService, userMapper);
        ResponseEntity<?> response = userController.save("");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}