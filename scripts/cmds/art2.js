const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports = {
  config: {
    name: 'art2',
    version: '1.5',
    author: 'Mr Stoic',
    countDown: 0,
    role: 0,
  shortDescription: {
      vi: "",
      en: "Transform Image To Ai Image"
    },
    category: "Ai Generations",
    guide: {
      vi: "",
      en: "Reply to an image and type -art"
    },
  },

  onStart: async function ({ event, api, args, message }) {
    let imageUrl;

    if (event.type === "message_reply") {
      if (["photo", "sticker"].includes(event.messageReply.attachments[0]?.type)) {
        imageUrl = event.messageReply.attachments[0].url;
      } else {
        return api.sendMessage({ body: "❌ | Reply must be an image." }, event.threadID);
      }
    } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g)) {
      imageUrl = args[0];
    } else {
      return api.sendMessage({ body: "❌ | Reply to an image." }, event.threadID);
    }

    message.reply("✅ | Transforming your image...", async (err, info) => {
      if (err) {
        console.error(err);
        return;
      }

      const api_key = '3d0a1d4c-5251-4643-b094-6c1220745968';
      const prompt = args.slice(1).join(' ');
      let aspect_ratio = "square";

      try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);
        const dimensions = await getImageDimensions(imageBuffer);
        const ratio = dimensions.width / dimensions.height;

        if (ratio > 1.4) {
          aspect_ratio = "landscape";
        } else if (ratio < 0.8) {
          aspect_ratio = "portrait";
        }
      } catch (error) {
        console.error("Error getting image dimensions:", error);
      }

      async function generateImage(imageUrl, prompt) {
        try {
          const options = {
            method: 'POST',
            url: 'https://api.prodia.com/v1/sd/transform',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              'X-Prodia-Key': api_key,
            },
            data: {
              imageUrl: imageUrl,
              prompt: prompt,
              model: 'meinamix_meinaV9.safetensors [2ec66ab0]',
              denoising_strength: 0.40,
              negative_prompt: 'worst quality, normal quality, low quality, low res, blurry, text, watermark, logo, banner, extra digits, cropped, jpeg artifacts, signature, username, error, sketch ,duplicate, ugly, monochrome, horror, geometry, mutation, disgusting, bad anatomy, bad hands, three hands, three legs, bad arms, missing legs, missing arms, poorly drawn face, bad face, fused face, cloned face, worst face, three crus, extra crus, fused crus, worst feet, three feet, fused feet, fused thigh, three thigh, fused thigh, extra thigh, worst thigh, missing fingers, extra fingers, ugly fingers, long fingers, horn, realistic photo, extra eyes, huge eyes, 2girl, amputation, disconnected limbs',
style_preset: 'anime',
              sampler: 'Euler a',
              steps: 50,
              cfg_scale: 8,
              seed: -1,
              upscale: true,
              aspect_ratio: aspect_ratio,
            },
          };

          const response = await axios(options);
          const job = response.data.job;

          while (true) {
            const jobResponse = await axios.get(`https://api.prodia.com/v1/job/${job}`, {
              headers: {
                accept: 'application/json',
                'X-Prodia-Key': api_key,
              },
            });

            if (jobResponse.data.status === 'succeeded') {
              return jobResponse.data.imageUrl;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (err) {
          console.error(err);
          throw err;
        }
      }

      try {
        const imageLink = await generateImage(imageUrl, prompt);
        console.log('Generated image URL:', imageLink);

        const response = await axios.get(imageLink, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);

        const imageFileName = 'generated_image.png';
        const imagePath = path.join(__dirname, imageFileName);
        fs.writeFileSync(imagePath, imageBuffer);

        await api.sendMessage({
          body: `✅ | Image Transformed\n\n`,
          attachment: fs.createReadStream(imagePath),
        }, event.threadID);
      } catch (error) {
        console.error(error);
      }
    });
  }
};

async function getImageDimensions(imageBuffer) {
  const imageSize = require('image-size');
  const dimensions = imageSize(imageBuffer);
  return dimensions;
        }