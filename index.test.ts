import { test, expect } from "vitest";
import { run, Workflow } from "@stepci/runner";

test("example test", async () => {
  const workflow: Workflow = {
    version: "1.1",
    name: "Status Test",
    env: {
      host: "localhost:3000",
    },
    tests: {
      example: {
        steps: [
          {
            name: "GET request",
            http: {
              url: "http://{{env.host}}/api/hello",
              method: "GET",
              check: {
                status: 200,
              },
            },
          },
        ],
      },
    },
  };
  const { result } = await run(workflow);

  expect(result.passed).toBe(true);
});
