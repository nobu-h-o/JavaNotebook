package com.example.demo;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@CrossOrigin // Enables CORS similar to express' cors middleware
public class CompileController {

    // Mapping of supported languages to their details
    private static final Map<String, Map<String, String>> LANGUAGE_MAP = new HashMap<>();
    static {
        LANGUAGE_MAP.put("c", Map.of("language", "c", "version", "10.2.0"));
        LANGUAGE_MAP.put("cpp", Map.of("language", "c++", "version", "10.2.0"));
        LANGUAGE_MAP.put("python", Map.of("language", "python", "version", "3.10.0"));
        LANGUAGE_MAP.put("java", Map.of("language", "java", "version", "15.0.2"));
    }

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/compile")
    public ResponseEntity<?> compile(@RequestBody CodeRequest request) {
        // Check if the language is supported
        if (!LANGUAGE_MAP.containsKey(request.getLanguage())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("error", "Unsupported language"));
        }

        // Retrieve language details for the provided language
        Map<String, String> langDetails = LANGUAGE_MAP.get(request.getLanguage());

        // Build the payload for the external API
        Map<String, Object> payload = new HashMap<>();
        payload.put("language", langDetails.get("language"));
        payload.put("version", langDetails.get("version"));
        payload.put("stdin", request.getInput());

        // Build the files list (one file with name "main")
        List<Map<String, String>> files = new ArrayList<>();
        Map<String, String> file = new HashMap<>();
        file.put("name", "main");
        file.put("content", request.getCode());
        files.add(file);
        payload.put("files", files);

        // Prepare headers and the HTTP entity for the POST request
        String url = "https://emkc.org/api/v2/piston/execute";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            // Call the external compilation API
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                Map body = response.getBody();
                if (body != null && body.containsKey("run")) {
                    // Return the "run" part of the response
                    return ResponseEntity.ok(body.get("run"));
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Collections.singletonMap("error", "Invalid response from compilation service"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("error", "Something went wrong"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Something went wrong"));
        }
    }
}
