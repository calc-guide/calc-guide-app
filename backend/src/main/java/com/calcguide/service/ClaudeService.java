package com.calcguide.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ClaudeService {

    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String ANTHROPIC_VERSION = "2023-06-01";

    private static final String FALLBACK_SYSTEM_PROMPT =
            "You are a knowledgeable and patient calculus tutor. Guide students with clear " +
            "explanations and encourage critical thinking.";

    // Universal capability appended to every tutor's system prompt: lets the tutor
    // draw live graphs. The frontend renders a ```desmos fenced block as an
    // interactive Desmos graph.
    private static final String GRAPH_CAPABILITY =
            "\n\nGraphing: when a graph would help the student see a concept, output a " +
            "fenced code block with language `desmos`, one expression per line in " +
            "Desmos/LaTeX syntax (e.g. y=x^2). It renders as a live, interactive graph " +
            "in the chat. Use it for curves, tangent lines, and visual intuition, not " +
            "for plain arithmetic.";

    private final RestClient restClient;
    private final String model;
    private final int maxTokens;
    private final Map<String, String> systemPrompts;

    public ClaudeService(
            RestClient.Builder builder,
            @Value("${anthropic.api-key}") String apiKey,
            @Value("${anthropic.model}") String model,
            @Value("${anthropic.max-tokens}") int maxTokens) throws IOException {
        this.model = model;
        this.maxTokens = maxTokens;
        this.restClient = builder
                .baseUrl(ANTHROPIC_API_URL)
                .defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", ANTHROPIC_VERSION)
                .defaultHeader("content-type", MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.systemPrompts = loadPersonalities();
    }

    private Map<String, String> loadPersonalities() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(new ClassPathResource("personalities.json").getInputStream());
        Map<String, String> prompts = new HashMap<>();
        for (JsonNode p : root.get("personalities")) {
            prompts.put(p.get("id").asText(), p.get("systemPrompt").asText());
        }
        return prompts;
    }

    public String chat(String tutorId, String userMessage, List<Map<String, String>> history,
                       com.calcguide.model.ChatRequest.Attachment attachment) {
        String systemPrompt = systemPrompts.getOrDefault(tutorId, FALLBACK_SYSTEM_PROMPT) + GRAPH_CAPABILITY;

        List<Map<String, Object>> messages = new ArrayList<>();
        if (history != null) {
            for (Map<String, String> entry : history) {
                String role = "tutor".equals(entry.get("role")) ? "assistant" : entry.get("role");
                messages.add(Map.of("role", role, "content", entry.get("content")));
            }
        }

        if (attachment != null) {
            List<Map<String, Object>> content = new ArrayList<>();
            content.add(Map.of(
                    "type", "image",
                    "source", Map.of(
                            "type", "base64",
                            "media_type", attachment.mediaType(),
                            "data", attachment.data()
                    )
            ));
            if (userMessage != null && !userMessage.isBlank()) {
                content.add(Map.of("type", "text", "text", userMessage));
            }
            messages.add(Map.of("role", "user", "content", content));
        } else {
            messages.add(Map.of("role", "user", "content", userMessage));
        }

        Map<String, Object> body = Map.of(
                "model", model,
                "max_tokens", maxTokens,
                "system", systemPrompt,
                "messages", messages
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

    record AnthropicResponse(List<ContentBlock> content) {}
    record ContentBlock(String type, String text) {}
}
