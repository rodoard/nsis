import fs from 'fs';
import util from 'util';
import { exec as _exec_ } from 'child_process';
import { error } from '@sveltejs/kit';
import path from 'path';
import { fileURLToPath } from 'url';
import { json } from '@sveltejs/kit';

const __filename = fileURLToPath(import.meta.url);

const exec = util.promisify(_exec_);
const cwd = `${path.dirname(__filename)}`;

async function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log('Directory does not exist. Creating:', dirPath);
    await fs.promises.mkdir(dirPath, { recursive: true });
  }
}

async function saveImage(buffer, name) {
  const dirPath = path.join(cwd, 'data');
  await ensureDirectoryExists(dirPath);

  const filePath = path.join(dirPath, `${name}.png`);
  console.log('Saving image:', name, 'Buffer Length:', buffer.byteLength);

  await fs.promises.writeFile(filePath, Buffer.from(buffer));
}

export async function POST(event) {
  const data = await event.request.formData();

  try {
    // Retrieve and log images
    const image1 = await data.get('image1').arrayBuffer();
    const image2 = await data.get('image2').arrayBuffer();

    console.log('Image 1 size:', image1.byteLength);
    console.log('Image 2 size:', image2.byteLength);

    // Save both images
    await Promise.all(
      [
        [image1, 'image1'],
        [image2, 'image2'],
      ].map(([buffer, name]) => saveImage(buffer, name))
    );
  } catch (e) {
    console.error('Error saving images:', e);
    throw error(400, 'Failed to save images.');
  }

  try {
    // Process images with external Python script
    const { stdout, stderr } = await exec(`python ${path.join(cwd, 'embedder.py')} 2>/dev/null`);

    if (stderr) {
      console.error('Error from Python script:', stderr);
      throw error(400, 'Failed to process challenge.');
    }

    return json({
      score: Number(stdout),
    });
  } catch (e) {
    console.error('Error executing Python script:', e);
    throw error(400, 'Failed to process challenge.');
  }
}
