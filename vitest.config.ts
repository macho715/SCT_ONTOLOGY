import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  cacheDir: ".vitest-cache",
  resolve: {
    alias: { "@": path.resolve(__dirname, "apps/web/src") }
  },
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
