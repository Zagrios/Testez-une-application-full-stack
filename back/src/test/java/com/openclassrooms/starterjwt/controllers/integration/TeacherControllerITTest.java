package com.openclassrooms.starterjwt.controllers.integration;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class TeacherControllerITTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtils jwtUtils;

    private String jwt;

    @BeforeEach
    void setUp() {
        UserDetailsImpl userDetails = UserDetailsImpl.builder().username("yoga@studio.com").build();
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);
        jwt = jwtUtils.generateJwtToken(authentication);
    }

    @Test
    public void testFindById() throws Exception {
        mockMvc.perform(get("/api/teacher/1")
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void testFindByIdNotFound() throws Exception {
        mockMvc.perform(get("/api/teacher/-1")
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isNotFound())
                .andDo(print());
    }

    @Test
    public void testFindByIdBadRequest() throws Exception {
        mockMvc.perform(get("/api/teacher/notnumber")
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isBadRequest())
                .andDo(print());
    }

    @Test
    public void testFindByIdUnauthorized() throws Exception {
        mockMvc.perform(get("/api/teacher/1")
                        .header("Authorization", "Bearer jwt not valid"))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }

    @Test
    public void testFindAll() throws Exception {
        mockMvc.perform(get("/api/teacher")
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk())
                .andDo(print());
    }

    @Test
    public void testFindAllUnauthorized() throws Exception {
        mockMvc.perform(get("/api/teacher")
                        .header("Authorization", "Bearer jwt not valid"))
                .andExpect(status().isUnauthorized())
                .andDo(print());
    }
}
