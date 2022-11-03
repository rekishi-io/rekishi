import { test, expect } from "vitest";
import { run, Workflow } from "@stepci/runner";

test("API: organization", async () => {
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
            name: "POST request",
            http: {
              url: "http://{{env.host}}/api/v1/organizations",
              method: "POST",
              body: JSON.stringify({
                organization_id: "id_1",
                name: "new org",
              }),
              headers: { "Content-Type": "application/json" },
              check: {
                status: 200,
                json: {
                  organization_id: "id_1",
                  name: "new org",
                  object: "organization",
                },
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
