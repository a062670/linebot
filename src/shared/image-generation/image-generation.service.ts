import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as unzipper from 'unzipper';

@Injectable()
export class ImageGenerationService {
  async generate(input: string) {
    try {
      const token = process.env.NOVEL_AI_API_KEY;
      const negativePrompt =
        'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bad feet';
      const seed = Math.floor(Math.random() * 10000000000);
      const body = {
        input: input,
        model: 'nai-diffusion-3',
        action: 'generate',
        parameters: {
          params_version: 3,
          width: 832,
          height: 1216,
          scale: 5,
          sampler: 'k_euler_ancestral',
          steps: 23,
          n_samples: 1,
          ucPreset: 0,
          qualityToggle: true,
          sm: false,
          sm_dyn: false,
          dynamic_thresholding: false,
          controlnet_strength: 1,
          legacy: false,
          add_original_image: true,
          cfg_rescale: 0,
          noise_schedule: 'karras',
          legacy_v3_extend: false,
          skip_cfg_above_sigma: null,
          seed: seed,
          negative_prompt: negativePrompt,
          reference_image_multiple: [],
          reference_information_extracted_multiple: [],
          reference_strength_multiple: [],
          deliberate_euler_ancestral_bug: false,
          prefer_brownian: true,
        },
      };
      const response = await fetch(
        'https://image.novelai.net/ai/generate-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      // 失敗時解析錯誤訊息
      if (!response.ok) {
        const data = await response.json();
        throw new Error(`${data.statusCode} ${data.message}`);
      }

      // 成功會取得zip檔，解壓縮存到public資料夾
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const folder = `public/image-generation/${Date.now()}`;
      fs.mkdirSync(folder, { recursive: true });
      const directory = await unzipper.Open.buffer(buffer);
      await directory.extract({ path: folder });
      const files = fs
        .readdirSync(folder)
        .map((item) => `${process.env.WEBSITE_URL}/${folder}/${item}`);
      return { urls: files };
    } catch (error) {
      throw new Error(error);
    }
  }
}
