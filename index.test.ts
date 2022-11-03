import { test, expect, it, describe } from "vitest";
import { run, Workflow } from "@stepci/runner";
import { PostHandlerInput } from "./pages/api/v1/users";

describe("API: organization", async () => {
  it("Create Organization", async () => {
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
                  organization_id: "org_id",
                  name: "new org",
                }),
                headers: { "Content-Type": "application/json" },
                check: {
                  status: 200,
                  json: {
                    organization_id: "org_id",
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

  it("Create User", async () => {
    const body: PostHandlerInput["body"] = {
      organization_id: "org_id",
      user_id: "user_id",
      email: "user@email.com",
      name: "John Doe",
    };

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
                url: "http://{{env.host}}/api/v1/users",
                method: "POST",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
                check: {
                  status: 200,
                  json: {
                    organization_id: "org_id",
                    user_id: "user_id",
                    email: "user@email.com",
                    name: "John Doe",
                    object: "user",
                  },
                },
              },
            },
          ],
        },
      },
    };
    const { result } = await run(workflow);
    console.log(result.tests[0]);

    expect(result.passed).toBe(true);
  });
});
