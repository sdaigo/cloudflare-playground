import type { IRequest } from "itty-router";
import { ALL_IMAGES } from "../data/image_store";

export default async function createImage(request: IRequest) {
  const req: { id: string; url: string; author: string } = await request.json();

  const newImage = {
    id: Number.parseInt(req.id, 10),
    url: req.url,
    author: req.author,
  };

  ALL_IMAGES.unshift(newImage);

  return new Response(JSON.stringify(newImage), {
    status: 201,
    headers: {
      "content-type": "application/json",
    },
  });
}
