package com.calcguide.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
public class SpaController implements ErrorController {

    // Browser requests (text/html) that 404 → serve React app
    @RequestMapping(value = "/error", produces = MediaType.TEXT_HTML_VALUE)
    public String spaFallback() {
        return "forward:/index.html";
    }

    // API / non-HTML requests that error → return JSON
    @RequestMapping("/error")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiError(HttpServletRequest request) {
        Integer status = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        String path = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        return ResponseEntity
                .status(status != null ? status : 500)
                .body(Map.of(
                        "status", status != null ? status : 500,
                        "path", path != null ? path : ""
                ));
    }
}
