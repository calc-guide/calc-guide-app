package com.calcguide.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class ClaudeService {

    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String ANTHROPIC_VERSION = "2023-06-01";

    private static final String SYSTEM_PROMPT = """
            You are a knowledgeable and patient tutor. Your role is to help students understand \
            concepts deeply rather than simply giving them answers. Guide them with clear \
            explanations, relevant examples, and follow-up questions that encourage critical \
            thinking. Adapt your teaching style to the student's apparent level of understanding. \
            When a student is stuck, break the problem into smaller, manageable steps.""";

    private final RestClient restClient;
    private final String model;
    private final int maxTokens;

    public ClaudeService(
            RestClient.Builder builder,
            @Value("${anthropic.api-key}") String apiKey,
            @Value("${anthropic.model}") String model,
            @Value("${anthropic.max-tokens}") int maxTokens) {
        this.model = model;
        this.maxTokens = maxTokens;
        this.restClient = builder
                .baseUrl(ANTHROPIC_API_URL)
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", ANTHROPIC_VERSION)
                .defaultHeader("content-type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String chat(String userMessage) {
        Map<String, Object> body = Map.of(
                "model", model,
                "max_tokens", maxTokens,
                "system", SYSTEM_PROMPT,
                "messages", List.of(Map.of("role", "user", "content", userMessage))
        );

        AnthropicResponse response = restClient.post()
                .body(body)
                .retrieve()
                .body(AnthropicResponse.class);

        if (response == null || response.content() == null || response.content().isEmpty()) {
            throw new IllegalStateException("Empty response from Anthropic API");
        }

        return response.content().getFirst().text();
    }

    // Internal types for deserializing the Anthropic Messages API response
    record AnthropicResponse(List<ContentBlock> content) {}
    record ContentBlock(String type, String text) {}
}
