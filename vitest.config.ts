import {defineConfig} from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        api: { port: 3002 },
        globals: true,
        setupFiles: "tests/setup.ts"
    },

});