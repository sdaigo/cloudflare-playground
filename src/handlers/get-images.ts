import type { IRequest } from "itty-router";
import { ALL_IMAGES } from "../data/image_store";

export default function getImages(request: IRequest) {
  if (request.query.count) {
    return new Response(
      JSON.stringify(ALL_IMAGES.slice(0, Number.parseInt(request.query.count[0], 10))),
      {
        headers: {
          "content-type": "application/json",
        },
      },
    );
  }

  return new Response(JSON.stringify(ALL_IMAGES), {
    headers: {
      "content-type": "application/json",
    },
  });
}
