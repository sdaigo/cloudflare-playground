import type { IRequest } from "itty-router";
import { ResultAsync } from "neverthrow";

export default async function getImages(request: IRequest, env: Env) {
  const limit = request.query.count ? request.query.count[0] : 10;

  const result = ResultAsync.fromPromise(
    env.DB.prepare(`
		SELECT i.*, c.display_name AS category_display_name
		FROM images i
		INNER JOIN image_categories c ON i.category_id = c.id
		ORDER BY created_at DESC LIMIT ?1`)
      .bind(limit)
      .all(),
    () => {
      return { message: "No images found" };
    },
  );

  return result.match(
    images => {
      if (!images.success) {
        return new Response("There was a problem retrieving images", { status: 500 });
      }

      return new Response(JSON.stringify(images.results), {
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
