import jimp from "jimp";

async function main() {
  // Read the image.
  const image = await jimp.read("test/test.jpg");

  // Resize the image to width 150 and auto height.
  await image.resize(3000, jimp.AUTO);

  // Save and overwrite the image
  await image.writeAsync("test/test2.jpg");
}

main();