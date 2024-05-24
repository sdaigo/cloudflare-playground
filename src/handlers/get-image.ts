import type { IRequest } from "itty-router";
import { ResultAsync } from "neverthrow";

export default function getImage(request: IRequest, env: Env) {
  const stmt = env.DB.prepare(`
    SELECT i.*, c.display_name AS category_display_name
    FROM images i
    INNER JOIN image_categories c ON i.category_id = c.id
    WHERE i.id = ?1`).bind(request.params.id);

  const result = ResultAsync.fromPromise(
    stmt.first(), //
    () => {
      return { message: "No images found" };
    },
  );

  return result.match(
    image => {
      if (!image) {
        return new Response(JSON.stringify({ message: `Not Found: id ${request.params.id}` }), {
          status: 404,
          headers: {
            "content-type": "application/json",
          },
        });
      }

      return new Response(JSON.stringify(image), {
        headers: {
          "content-type": "application/json",
        },
      });
    },
    error => {
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    },
  );
}
