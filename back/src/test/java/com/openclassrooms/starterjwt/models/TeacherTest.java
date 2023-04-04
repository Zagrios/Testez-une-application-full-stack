package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TeacherTest {

    @Test
    public void testTeacherBuilder() {
        Long id = 1L;
        String lastName = "Doe";
        String firstName = "John";

        Teacher teacher = Teacher.builder()
                .id(id)
                .lastName(lastName)
                .firstName(firstName)
                .build();

        assertEquals(id, teacher.getId());
        assertEquals(lastName, teacher.getLastName());
        assertEquals(firstName, teacher.getFirstName());
    }

    @Test
    public void testTeacherSettersAndGetters() {
        Long id = 1L;
        String lastName = "Doe";
        String firstName = "John";

        Teacher teacher = new Teacher();
        teacher.setId(id);
        teacher.setLastName(lastName);
        teacher.setFirstName(firstName);

        assertEquals(id, teacher.getId());
        assertEquals(lastName, teacher.getLastName());
        assertEquals(firstName, teacher.getFirstName());
    }
}