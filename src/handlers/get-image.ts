import type { IRequest } from "itty-router";
import { ALL_IMAGES } from "../data/image_store";

export default function getImage(request: IRequest) {
  const image = ALL_IMAGES.find(image => image.id === Number.parseInt(request.params.id));

  if (!image) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(JSON.stringify(image), {
    headers: {
      "content-type": "application/json",
    },
  });
}
