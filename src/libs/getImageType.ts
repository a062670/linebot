import * as isAnimated from 'is-animated';
import imageSize from 'image-size';

type ImageType = {
  animated: boolean;
  height: number;
  width: number;
};

export default async function getImageType(
  imageUrl: string,
): Promise<ImageType | string> {
  const imageType: ImageType = {
    animated: false,
    height: 0,
    width: 0,
  };

  try {
    const resp = await fetch(imageUrl);
    if (!resp.ok) {
      return `網址 ${imageUrl} 錯誤，無法取得圖片。`;
    }

    const headers = resp.headers;
    const contentLength = +headers.get('Content-Length');
    const contentType = headers.get('Content-Type');

    // 只接受 JPEG PNG GIF
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(contentType)) {
      return `只接受 JPEG PNG GIF，網址 ${imageUrl} 為 ${contentType}。`;
    }

    const data = await resp.arrayBuffer();
    const buffer = Buffer.from(data);

    imageType.animated = isAnimated(buffer);

    if (
      contentType === 'image/png' &&
      imageType.animated &&
      contentLength > 300000
    ) {
      return `檔案 APNG 大小 ${contentLength} 過大，超過限制 300000。`;
    }

    if (contentType === 'image/gif' && contentLength > 10000000) {
      return `檔案 GIF 大小 ${contentLength} 過大，超過限制 10000000。`;
    }

    if (imageType.animated) {
      const { height, width } = imageSize(buffer);
      if (!height || !width) {
        imageType.animated = false;
      }
      imageType.height = height || 0;
      imageType.width = width || 0;
    }
    return imageType;
  } catch {
    return `網址 ${imageUrl} 錯誤，無法取得圖片。`;
  }
}
