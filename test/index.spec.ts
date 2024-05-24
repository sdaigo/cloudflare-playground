// test/index.spec.ts
import { SELF, createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import { describe, expect, it } from "vitest";
import worker from "../src/index";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Photo Service", () => {
  describe("GET /images", () => {
    it("returns a 404 for unknown routes", async () => {
      const res = await SELF.fetch(new IncomingRequest("http://example.com/invalid-endpoint"));
      expect(res.status).toEqual(404);
    });

    it("returns a 200 OK response", async () => {
      const res = await SELF.fetch(new IncomingRequest("http://example.com/images"));
      expect(res.status).toEqual(200);
    });

    it("returns images in the response", async () => {
      const res = await SELF.fetch(new IncomingRequest("http://example.com/images"));
      const json = await res.json();

      expect(json).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 3,
            url: "https://bar.com/img3",
            author: "Lara Lobster",
          }),
        ]),
      );
    });

    it("returns a set number of images if count is provided", async () => {
      const res = await SELF.fetch(new IncomingRequest("http://example.com/images?count=2"));
      const json = await res.json();

      expect(json).toHaveLength(2);
    });
  });

  describe("POST /images", () => {
    it("returns a 201 Created response", async () => {
      const payload = {
        id: 4,
        url: "https://bar.com/img4.png",
        author: "Larry Lobster",
      };

      const resp = await SELF.fetch("http://example.com/images", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      expect(resp.status).toEqual(201);
    });

    it("returns an image in the response", async () => {
      const payload = {
        id: 4,
        url: "https://bar.com/img4.png",
        author: "Larry Lobster",
      };

      const resp = await SELF.fetch("http://example.com/images", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await resp.json();

      expect(json).toEqual(expect.objectContaining(payload));
    });
  });
});
