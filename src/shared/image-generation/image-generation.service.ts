import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';

@Injectable()
export class ImageGenerationService {
  async generate(input: string) {
    try {
      let inputList = input.split(' ');

      const token = process.env.NOVEL_AI_API_KEY;

      // 模型預設為 nai-diffusion-3
      let model = 'nai-diffusion-3';
      // 如果有 -furry 參數
      if (inputList.includes('-furry')) {
        // 移除
        const index = inputList.indexOf('-furry');
        inputList.splice(index, 1);
        // 更換模型
        model = 'nai-diffusion-furry-3';
      }

      // 負面提示
      const negativePrompt =
        'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bad feet';

      // 產生隨機種子
      const seed = Math.floor(Math.random() * 10000000000);

      // 參考圖片
      const referenceImages = [];
      const referenceInformationExtracted = [];
      const referenceStrength = [];
      if (inputList.includes('-ref')) {
        const index = inputList.indexOf('-ref');
        inputList.splice(index, 1);
        // 從 index 開始，取得參考圖片，直到沒有 http 開頭
        for (let i = index; i < inputList.length; i++) {
          if (inputList[i].startsWith('http')) {
            // 讀取圖片並轉成 base64
            const response = await fetch(inputList[i]);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            referenceImages.push(base64);
            referenceInformationExtracted.push(1);
            referenceStrength.push(0.6);
          } else {
            break;
          }
        }
      }

      // 移除參考圖片
      inputList = inputList.filter((item) => !item.startsWith('http'));

      // 重新組合參數
      const newInput =
        inputList.join(' ') +
        ', best quality, amazing quality, very aesthetic, absurdres';

      // 設定參數
      const body = {
        input: newInput,
        model: model,
        action: 'generate',
        parameters: {
          params_version: 3,
          width: 768,
          height: 1024,
          scale: 10,
          sampler: 'k_dpmpp_2m_sde',
          steps: 28,
          n_samples: 1,
          ucPreset: 0,
          qualityToggle: true,
          sm: false,
          sm_dyn: false,
          dynamic_thresholding: false,
          controlnet_strength: 1,
          legacy: false,
          add_original_image: true,
          cfg_rescale: 0.18,
          noise_schedule: 'karras',
          legacy_v3_extend: false,
          skip_cfg_above_sigma: null,
          seed: seed,
          negative_prompt: negativePrompt,
          reference_image_multiple: referenceImages,
          reference_information_extracted_multiple:
            referenceInformationExtracted,
          reference_strength_multiple: referenceStrength,
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
      const zipFile = `${folder}/zip.zip`;
      fs.mkdirSync(folder, { recursive: true });
      fs.writeFileSync(zipFile, buffer);

      // 解壓縮
      const zip = new AdmZip(zipFile);
      zip.extractAllTo(folder, true);

      // 刪除zip檔
      fs.unlinkSync(zipFile);

      // 取得所有圖片路徑
      const files = fs
        .readdirSync(folder)
        .map((item) => `${process.env.WEBSITE_URL}/${folder}/${item}`);
      return { urls: files };
    } catch (error) {
      throw new Error(error);
    }
  }
}
