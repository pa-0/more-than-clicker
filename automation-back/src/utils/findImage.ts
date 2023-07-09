const sharp = require("sharp");
import robotjs from "robotjs";
import Jimp from "jimp";

export const findImage = async (
  aspectRatio: number,
  inner: string,
  max = 1
) => {
  try {
    const pic = robotjs.screen.capture();
    const width = pic.byteWidth / pic.bytesPerPixel; // pic.width is sometimes wrong!
    const height = pic.height;
    const image = new Jimp(width, height);
    let red: any, green: any, blue: any;
    pic.image.forEach((byte: any, i: number) => {
      switch (i % 4) {
        case 0:
          blue = byte;
          break;
        case 1:
          green = byte;
          break;
        case 2:
          red = byte;
          break;
        case 3:
          image.bitmap.data[i - 3] = red;
          image.bitmap.data[i - 2] = green;
          image.bitmap.data[i - 1] = blue;
          image.bitmap.data[i] = 255;
          break;
      }
    });
    const innerImg = await Jimp.read(inner);
    //const outterImg = image
    //await innerImg.writeAsync(`images/${Date.now()}.png`);
    //await outterImg.writeAsync(`images/${Date.now()}.png`);
    const innerBuffer = await innerImg.getBufferAsync(Jimp.MIME_PNG);
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
    // max is the maximum occurences to find
    const file_o = sharp(buffer);
    const file_i = sharp(innerBuffer);
    const buff_o = await file_o.raw().toBuffer();
    const buff_i = await file_i.raw().toBuffer();
    const meta_o = await file_o.metadata();
    const meta_i = await file_i.metadata();
    const size_o = meta_o.width * meta_o.channels;
    const size_i = meta_i.width * meta_i.channels;

    const upper = buff_i.slice(0, size_i); // upper row of inner
    let found = -1;
    const finds = [];
    if (meta_i.width <= meta_o.width && meta_i.height <= meta_o.height) {
      // must be containable within
      do {
        found = buff_o.indexOf(upper, found + 1); // upper row is present, so its another candidate

        if (found != -1) {
          let matches: any = true;

          const oy = Math.floor(found / size_o);
          const ox = Math.floor((found - size_o * oy) / meta_o.channels);

          for (let y = 1; matches && y < meta_i.height; y++) {
            // start from one as upper row is already matched

            const pos_i = y * size_i;
            const pos_o = y * size_o + found;

            const slice_i = buff_i.slice(pos_i, pos_i + size_i);
            const slice_o = buff_o.slice(pos_o, pos_o + size_i);

            matches &= slice_o.equals(slice_i); // does next row also match?
          }

          if (matches) {
            finds.push({ x: ox, y: oy, w: meta_i.width, h: meta_i.height });
          }
        }
      } while (found != -1 && finds.length < max);
    }
    if (finds[0]) {
      const imageWCenter = meta_i.width / 2;
      const imageHCenter = meta_i.height / 2;
      return {
        x: (finds[0].x + imageWCenter) / aspectRatio,
        y: (finds[0].y + imageHCenter) / aspectRatio,
      };
    } else {
      return {};
    }
  } catch (e: any) {
    console.log("Error to find image in screen. Maybe no image.");
    return {};
  }
};
