package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class SessionTest {

    @Test
    public void testSessionBuilder() {
        Long id = 1L;
        String name = "Sample Session";
        Date date = new Date();
        String description = "Sample session description";
        Teacher teacher = new Teacher();
        List<User> users = new ArrayList<>();

        Session session = Session.builder()
                .id(id)
                .name(name)
                .date(date)
                .description(description)
                .teacher(teacher)
                .users(users)
                .build();

        assertEquals(id, session.getId());
        assertEquals(name, session.getName());
        assertEquals(date, session.getDate());
        assertEquals(description, session.getDescription());
        assertEquals(teacher, session.getTeacher());
        assertEquals(users, session.getUsers());
    }

    @Test
    public void testSessionSettersAndGetters() {
        Long id = 1L;
        String name = "Sample Session";
        Date date = new Date();
        String description = "Sample session description";
        Teacher teacher = new Teacher();
        List<User> users = new ArrayList<>();

        Session session = new Session();
        session.setId(id);
        session.setName(name);
        session.setDate(date);
        session.setDescription(description);
        session.setTeacher(teacher);
        session.setUsers(users);

        assertEquals(id, session.getId());
        assertEquals(name, session.getName());
        assertEquals(date, session.getDate());
        assertEquals(description, session.getDescription());
        assertEquals(teacher, session.getTeacher());
        assertEquals(users, session.getUsers());
    }
}