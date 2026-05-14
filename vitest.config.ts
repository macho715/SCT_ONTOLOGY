import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      reportOnFailure: true,
      exclude: [
        "node_modules/**",
        "tests/**",
        "scripts/**",
        "migrations/**",
        "seeds/**",
        "**/*.d.ts",
        "docs/**",
        ".claude/**",
        "server/src/generated/**"
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 65
      }
    }
  }
});
