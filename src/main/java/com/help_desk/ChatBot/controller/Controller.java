package com.help_desk.ChatBot.controller;


import com.help_desk.ChatBot.service.AiService;
import jakarta.servlet.ServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/v1/helpdesk")
@RequiredArgsConstructor
public class Controller {

    private final AiService aiService;

    @PostMapping
    public ResponseEntity<String> getResponse(@RequestBody String query, @RequestHeader("conversationId") String conversationId) {
        return ResponseEntity.ok(aiService.getResponseFromAssistant(query,conversationId));
    }

    @PostMapping("/stream")
    public Flux<String> streamResponse(@RequestBody String query, @RequestHeader("conversationId") String conversationId) {
        return aiService.streamResponse(query,conversationId);
    }
}
