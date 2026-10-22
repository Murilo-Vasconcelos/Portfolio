import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Resolve o alias "@/" do tsconfig.json
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    // Os testes de ponta a ponta (tests/e2e) rodam no Playwright
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});
