import { ImageEmbedder, FilesetResolver } from "@mediapipe/tasks-vision";
import imageEmbberTflite from "../mediapipe/image_embedder.tflite"

let imageEmbedder

const createImageEmbedder = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  if (!imageEmbedder) {
    imageEmbedder = await ImageEmbedder.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/image_embedder/mobilenet_v3_small/float32/1/mobilenet_v3_small.tflite`
      },
      runningMode: "IMAGE",
      quantize: true
    });
  }

};

const getImageEmbedder = () => imageEmbedder
const cosineSimilarity = (u, v) => ImageEmbedder.cosineSimilarity(u, v)
export {
  createImageEmbedder,
  getImageEmbedder,
  cosineSimilarity
}
