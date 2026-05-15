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
        "server/src/generated/**",
        "server/src/worker.ts",
        "server/src/types.ts",
        "vitest.config.ts"
      ],
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 70
      }
    }
  }
});
