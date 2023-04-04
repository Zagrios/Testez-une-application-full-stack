package com.openclassrooms.starterjwt.security.jwt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationServiceException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class AuthEntryPointJwtTest {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private AuthenticationServiceException authException;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        request.setServletPath("/api/test");
        response = new MockHttpServletResponse();
        authException = new AuthenticationServiceException("Authentication error");
    }

    @Test
    void shouldReturnUnauthorizedResponse() throws IOException, ServletException {
        authEntryPointJwt.commence(request, response, authException);

        assertThat(response.getStatus()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);
        assertThat(response.getContentType()).isEqualTo("application/json");

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode responseBody = objectMapper.readTree(response.getContentAsString());

        assertThat(responseBody.get("status").intValue()).isEqualTo(HttpServletResponse.SC_UNAUTHORIZED);
        assertThat(responseBody.get("error").asText()).isEqualTo("Unauthorized");
        assertThat(responseBody.get("message").asText()).isEqualTo(authException.getMessage());
        assertThat(responseBody.get("path").asText()).isEqualTo(request.getServletPath());
    }
}