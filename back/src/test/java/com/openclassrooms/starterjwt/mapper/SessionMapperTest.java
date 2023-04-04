package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
public class SessionMapperTest {

    @InjectMocks
    private SessionMapperImpl sessionMapper;

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @Test
    public void testToEntity() {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setDescription("Test description");
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(Arrays.asList(1L, 2L));

        Teacher teacher = new Teacher();
        teacher.setId(1L);
        when(teacherService.findById(1L)).thenReturn(teacher);

        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);
        when(userService.findById(1L)).thenReturn(user1);
        when(userService.findById(2L)).thenReturn(user2);

        Session session = sessionMapper.toEntity(sessionDto);

        assertNotNull(session);
        assertEquals(sessionDto.getId(), session.getId());
        assertEquals(sessionDto.getDescription(), session.getDescription());
        assertEquals(sessionDto.getTeacher_id(), session.getTeacher().getId());
        assertEquals(sessionDto.getUsers().size(), session.getUsers().size());
    }

    @Test
    public void testToDto() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);

        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);
        List<User> users = Arrays.asList(user1, user2);

        Session session = new Session();
        session.setId(1L);
        session.setDescription("Test description");
        session.setTeacher(teacher);
        session.setUsers(users);

        SessionDto sessionDto = sessionMapper.toDto(session);

        assertNotNull(sessionDto);
        assertEquals(session.getId(), sessionDto.getId());
        assertEquals(session.getDescription(), sessionDto.getDescription());
        assertEquals(session.getTeacher().getId(), sessionDto.getTeacher_id());
        assertEquals(session.getUsers().size(), sessionDto.getUsers().size());
    }
}