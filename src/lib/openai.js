import fs from "fs";
import OpenAI from "openai";
let openai

async function createImageVariations(blob, { apiKey, num = 1 }) {
  if (!openai) {
    openai = new OpenAI({
      apiKey: apiKey
    });
  }
  const image = await openai.images.createVariation({
    image: blob,
    n: Math.min(num, 4),
    size: "256x256",
    response_formt: "b64_json"
  });

  return image.data
}

export {
  createImageVariations
}