"use strict";
const fp = require("fastify-plugin");
const {
  SearchFacesByImageCommand,
  RekognitionClient,
} = require("@aws-sdk/client-rekognition");

const collectionName = "kcd-collection";
const rekogClient = new RekognitionClient({
  region: fastify.config.AWS_REGION,
  credentials: {
    accessKeyId: fastify.config.AWS_KEY_ID,
    secretAccessKey:  fastify.config.AWS_ACCESS_KEY,
  },
});

module.exports = fp(async function (fastify, opts) {
  fastify.decorate("validateUser", async function (image) {
    const imageBuffer = Buffer.from(image, "base64");
    const data = await rekogClient.send(
      new SearchFacesByImageCommand({
        CollectionId: fastify.config.AWS_COLLECTION,
        Image: { Bytes: imageBuffer },
      })
    );
    console.log("Faces indexed:");
    const id = data.FaceMatches[0].Face.ExternalImageId;
    console.log(id);
    console.log(data.FaceMatches[0].Similarity);
    return id;
  });
});
