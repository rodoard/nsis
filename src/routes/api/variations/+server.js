import fs from "fs"
import util from "util"
import { exec as _exec_ } from "child_process"
import { error } from '@sveltejs/kit';
import path from "path"
import { fileURLToPath } from 'url';
import { json } from '@sveltejs/kit';
import fs from "fs";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);

const exec = util.promisify(_exec_);
const cwd = `${path.dirname(__filename)}`

async function saveImage(blob, name) {
  const buffer = Buffer.from(blob, 'binary');
  return fs.promises.writeFile(path.join(cwd, "data", `${name}.png`), buffer, 'binary')
}

const openai = new OpenAI();

export async function POST(event) {
  // Retrieve data from the request body
  const data = await event.request.formData()
  const image = await data.get('image').arrayBuffer()

  const result = await openai.images.createVariation({
    image,
    n: Math.min(num, 2),
    size: "256x256",
    response_format: "b64_json"
  });
  return json(
    {
      data: result.data
    }
  )
}