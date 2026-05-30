package com.calcguide.controller;

import com.calcguide.model.ChatRequest;
import com.calcguide.model.ChatResponse;
import com.calcguide.service.ClaudeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ClaudeService claudeService;

    public ChatController(ClaudeService claudeService) {
        this.claudeService = claudeService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String reply = claudeService.chat(request.tutorId(), request.message(), request.history(), request.attachment());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
