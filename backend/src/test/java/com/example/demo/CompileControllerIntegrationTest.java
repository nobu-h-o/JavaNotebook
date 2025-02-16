package com.example.demo;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class CompileControllerIntegrationTest {
  
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    public void testCompileEndpoint() {
        // Construct a sample request
        Map<String, String> request = new HashMap<>();
        request.put("code", "print(\"Hello, World!\")");
        request.put("language", "python");
        request.put("input", "");
        
        ResponseEntity<Map> response = restTemplate.postForEntity("/compile", request, Map.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
