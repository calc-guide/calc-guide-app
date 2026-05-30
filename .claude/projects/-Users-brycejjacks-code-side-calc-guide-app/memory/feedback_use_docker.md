---
name: feedback-use-docker
description: Always build/compile/run using Docker, not local Maven or Java commands
metadata:
  type: feedback
---

Use Docker for all build, compile, and run tasks in this project — not local Maven or Java commands.

**Why:** The local Java version may not match the project's required version (Java 21), and Docker guarantees the correct environment.

**How to apply:** When verifying a backend change compiles or the app runs, use `docker compose up --build` or `docker build` instead of `mvn compile` or `mvn spring-boot:run`.
