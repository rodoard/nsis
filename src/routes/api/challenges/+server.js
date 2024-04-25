import fs from "fs"
import util from "util"
import { exec as _exec_ } from "child_process"
import { error } from '@sveltejs/kit';
import path from "path"
import { fileURLToPath } from 'url';
import { json } from '@sveltejs/kit';

const __filename = fileURLToPath(import.meta.url);

const exec = util.promisify(_exec_);
const cwd = `${path.dirname(__filename)}`
async function saveImage(blob, name) {
  const buffer = Buffer.from(blob, 'binary');
  return fs.promises.writeFile(path.join(cwd, "data", `${name}.png`), buffer, 'binary')
}
export async function POST(event) {
  // Retrieve data from the request body
  const data = await event.request.formData()
  const image1 = await data.get('image1').arrayBuffer()
  const image2 = await data.get('image2').arrayBuffer()
  await Promise.all(
    [[image1, "image1"], [image2, "image2"]].map((param) => saveImage(...param))
  )
  const { stdout, stderr } = await exec(
    `python ${path.join(cwd, "embedder.py")}  2>/dev/null`
  )

  if (stderr) {
    console.error(stderr)
    error(400, "Failed to process challenge.")
  }

  return json({
    score: Number(stdout)
  });

}