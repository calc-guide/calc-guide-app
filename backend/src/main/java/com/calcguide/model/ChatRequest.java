package com.calcguide.model;

import java.util.List;
import java.util.Map;

public record ChatRequest(String message, String tutorId, List<Map<String, String>> history) {}
