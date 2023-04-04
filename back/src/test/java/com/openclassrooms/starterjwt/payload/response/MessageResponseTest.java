package com.openclassrooms.starterjwt.payload.response;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
public class MessageResponseTest {

    @Test
    public void testMessageResponse() {
        String message = "Sample message";

        MessageResponse messageResponse = new MessageResponse(message);

        assertEquals(message, messageResponse.getMessage());
    }

    @Test
    public void testSetMessage() {
        String initialMessage = "Initial message";
        String updatedMessage = "Updated message";

        MessageResponse messageResponse = new MessageResponse(initialMessage);
        messageResponse.setMessage(updatedMessage);

        assertEquals(updatedMessage, messageResponse.getMessage());
    }
}