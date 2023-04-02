package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class SessionServiceTest {
    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;

    private SessionService sessionService;

    private Session createSession(Long id) {
        return Session.builder()
                .name("session")
                .id(id)
                .users(new ArrayList<>()).build();
    }

    private User createUser(Long id) {
        return User.builder()
                .id(id)
                .email("test@test.com")
                .lastName("me")
                .firstName("notme")
                .password("azerty").build();
    }

    @BeforeEach
    public void setUp() {
        sessionService = new SessionService(sessionRepository, userRepository);
    }

    @Test
    public void createTest() {
        Session session = this.createSession(1L);
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        Session result = sessionService.create(session);
        assertThat(result).usingRecursiveComparison().isEqualTo(session);
    }

    @Test
    public void deleteTest() {
        Long id = 1L;
        doNothing().when(sessionRepository).deleteById(id);

        sessionService.delete(id);
        verify(sessionRepository, times(1)).deleteById(id);
    }

    @Test
    public void findAllTest() {
        Session session1 = this.createSession(1L);
        Session session2 = this.createSession(2L);
        List<Session> sessions = new ArrayList<>(Arrays.asList(session1, session2));
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();
        assertThat(result).isEqualTo(sessions);
    }

    @Test
    public void getByIdTest() {
        Long id = 1L;
        Session session = this.createSession(id);
        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(id);
        assertThat(result).isEqualTo(session);
    }

    @Test
    public void updateTest() {
        Long id = 1L;
        Session session = this.createSession(id);
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        Session result = sessionService.update(id, session);
        assertThat(result).isEqualTo(session);
    }

    @Test
    public void participateTest() {
        final Long sessionId = 1L;
        final Long userId = 1L;

        final Session session = this.createSession(sessionId);
        final User user = this.createUser(userId);

        when(this.sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(this.userRepository.findById(userId)).thenReturn(Optional.of(user));

        this.sessionService.participate(sessionId, userId);
        verify(this.sessionRepository, times(1)).save(session);

        assertTrue(session.getUsers().contains(user));
    }

    @Test
    public void participateBadRequestTest() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = this.createSession(sessionId);
        User user = this.createUser(userId);
        session.getUsers().add(user);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
    }

    @Test
    public void noLongerParticipateTest() {
        Long sessionId = 1L;
        Long userId = 1L;
        Session session = this.createSession(sessionId);
        User user = this.createUser(userId);
        session.getUsers().add(user);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(sessionId, userId);
        verify(sessionRepository, times(1)).save(session);

        assertFalse(session.getUsers().contains(user));
    }

    @Test
    public void noLongerParticipateNotFoundTest() {
        Long sessionId = 1L;
        Long userId = 1L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
    }


}