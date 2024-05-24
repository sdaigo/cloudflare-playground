import { Router } from "itty-router";
import createImage from "./handlers/create-image";
import getImage from "./handlers/get-image";
import getImages from "./handlers/get-images";

const router = Router();

router
  .get("/images", getImages) //
  .get("/images/:id", getImage)
  .post("/images", createImage)
  .get("*", () => new Response("Not Found", { status: 404 }));

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return router.fetch(request);
  },
};
