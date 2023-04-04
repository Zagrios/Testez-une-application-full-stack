package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserTest {

    @Test
    public void testUserBuilder() {
        Long id = 1L;
        String email = "john.doe@example.com";
        String lastName = "Doe";
        String firstName = "John";
        String password = "password123";
        boolean admin = true;

        User user = User.builder()
                .id(id)
                .email(email)
                .lastName(lastName)
                .firstName(firstName)
                .password(password)
                .admin(admin)
                .build();

        assertEquals(id, user.getId());
        assertEquals(email, user.getEmail());
        assertEquals(lastName, user.getLastName());
        assertEquals(firstName, user.getFirstName());
        assertEquals(password, user.getPassword());
        assertEquals(admin, user.isAdmin());
    }

    @Test
    public void testUserSettersAndGetters() {
        Long id = 1L;
        String email = "john.doe@example.com";
        String lastName = "Doe";
        String firstName = "John";
        String password = "password123";
        boolean admin = true;

        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setLastName(lastName);
        user.setFirstName(firstName);
        user.setPassword(password);
        user.setAdmin(admin);

        assertEquals(id, user.getId());
        assertEquals(email, user.getEmail());
        assertEquals(lastName, user.getLastName());
        assertEquals(firstName, user.getFirstName());
        assertEquals(password, user.getPassword());
        assertEquals(admin, user.isAdmin());
    }
}