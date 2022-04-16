import path from "path";
import sharp, { FormatEnum } from "sharp";
import NodeCache from "node-cache";

const imgCache = new NodeCache();

const imgResize = (location: string): string[] => {
  // if the location string is empty, return empty array
  if (location.length === 0) return [];

  // replace Window's \ with /
  if (location.includes("\\")) {
    const locationFixed: string[] = [];

    for (let i = 0; i < location.length; i++) {
      if (location[i] === "\\") locationFixed[i] = "/";
      else locationFixed[i] = location[i];
    }

    location = locationFixed.join("");
  }

  const fileNamePath: string[] = location.split("/");
  const fileName: string = fileNamePath[fileNamePath.length - 1];
  const nameOnly: string = fileName.split(".")[0];
  const fileExt: string = fileName.split(".")[1];
  const outFolder = path.join("dist", "output-images");
  let resizedFile = "";
  let outputFile = "";
  const imgSizes: string[] = [];

  // Check to see if images already exist in cache
  if (imgCache.get(nameOnly)) {
    const imgFiles: string[] = imgCache.get(nameOnly) as string[];

    return imgFiles;
  } else {
    // Resize original image
    try {
      resizedFile = nameOnly + "_125." + fileExt;
      outputFile = path.resolve(path.join(outFolder, nameOnly, resizedFile));
      const htmlImages = path.join("output-images", nameOnly, resizedFile);
      imgSizes.push(htmlImages);
      sharp(location).resize({ width: 125, height: 125 }).toFile(outputFile);
    } catch (error) {
      console.error("Error occurred trying to resize image with sharp:", error);
    }

    try {
      resizedFile = nameOnly + "_300." + fileExt;
      outputFile = path.join(outFolder, nameOnly, resizedFile);
      const htmlImages = path.join("output-images", nameOnly, resizedFile);
      imgSizes.push(htmlImages);
      sharp(location).resize({ width: 300 }).toFile(outputFile);
    } catch (error) {
      console.error("Error occurred trying to resize image with sharp:", error);
    }

    try {
      resizedFile = nameOnly + "_500." + fileExt;
      outputFile = path.join(outFolder, nameOnly, resizedFile);
      const htmlImages = path.join("output-images", nameOnly, resizedFile);
      imgSizes.push(htmlImages);
      sharp(location).resize({ width: 500 }).toFile(outputFile);
    } catch (error) {
      console.error("Error occurred trying to resize image with sharp:", error);
    }

    try {
      resizedFile = nameOnly + "_800." + fileExt;
      outputFile = path.join(outFolder, nameOnly, resizedFile);
      const htmlImages = path.join("output-images", nameOnly, resizedFile);
      imgSizes.push(htmlImages);
      const format = fileExt as keyof FormatEnum;
      sharp(location)
        .resize({ width: 800, height: 600 })
        .toFormat(format, {
          quality: 60,
        })
        .toFile(outputFile);
    } catch (error) {
      console.error("Error occurred trying to resize image with sharp:", error);
    }

    try {
      resizedFile = nameOnly + "_1080." + fileExt;
      outputFile = path.join(outFolder, nameOnly, resizedFile);
      const htmlImages = path.join("output-images", nameOnly, resizedFile);
      imgSizes.push(htmlImages);
      const format = fileExt as keyof FormatEnum;
      sharp(location)
        .resize({ width: 1080, height: 1080 })
        .toFormat(format, {
          quality: 60,
        })
        .toFile(outputFile);
    } catch (error) {
      console.error("Error occurred trying to resize image with sharp:", error);
    }

    try {
      resizedFile = nameOnly + "_1280." + fileExt;
      outputFile = path.join(outFolder, nameOnly, resizedFile);
      const htmlImages = path.join("output-images", nameOnly, resizedFile);
      imgSizes.push(htmlImages);
      const format = fileExt as keyof FormatEnum;
      sharp(location)
        .toFormat(format, {
          quality: 60,
        })
        .resize({ width: 1280, height: 720 })
        .toFile(outputFile);
    } catch (error) {
      console.error("Error occurred trying to resize image with sharp:", error);
    }

    try {
      resizedFile = nameOnly + "_1920." + fileExt;
      outputFile = path.join(outFolder, nameOnly, resizedFile);
      const htmlImages = path.join("output-images", nameOnly, resizedFile);
      const format = fileExt as keyof FormatEnum;
      imgSizes.push(htmlImages);
      sharp(location)
        .toFormat(format, {
          quality: 60,
        })
        .resize({ width: 1920, height: 1080 })
        .toFile(outputFile);
    } catch (error) {
      console.error("Error occurred trying to resize image with sharp:", error);
    }
  }

  // cache the images with file name as key
  imgCache.set(nameOnly, imgSizes);

  return imgSizes;
};
export default imgResize;
