"use strict";
const fp = require("fastify-plugin");
const {
  SearchFacesByImageCommand,
  RekognitionClient,
} = require("@aws-sdk/client-rekognition");
const fs = require("fs");
const REGION = "us-east-1";
const collectionName = "kcd-collection";
const rekogClient = new RekognitionClient({
  region: REGION,
  credentials: {
    accessKeyId: "AKIARCGSWNIGFKKYFZON",
    secretAccessKey: "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",
  },
});

module.exports = fp(async function (fastify, opts) {
  fastify.decorate("validateUser", async function (image) {
    const imageBuffer = Buffer.from(image, "base64");
    const data = await rekogClient.send(
      new SearchFacesByImageCommand({
        CollectionId: collectionName,
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
