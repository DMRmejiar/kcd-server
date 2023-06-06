const {
  CreateCollectionCommand,
  IndexFacesCommand,
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

const createCollection = async (collectionName) => {
  try {
    console.log(`Creating collection: ${collectionName}`);
    const data = await rekogClient.send(
      new CreateCollectionCommand({ CollectionId: collectionName })
    );
    console.log("Collection ARN:");
    console.log(data.CollectionArn);
    console.log("Status Code:");
    console.log(String(data.StatusCode));
    console.log("Success.", data);
    return data;
  } catch (err) {
    console.log("Error", err.stack);
  }
};

const saveImage = async (collectionName, imageName, id) => {
  try {
    const data = await rekogClient.send(
      new IndexFacesCommand({
        CollectionId: collectionName,
        Image: { Bytes: fs.readFileSync(imageName) },
        ExternalImageId: id,
      })
    );
    console.log("Faces indexed:");
    console.log(JSON.stringify(data));
  } catch (err) {
    console.log("Error", err.stack);
  }
};

const findByImage = async (collectionName, imageName) => {
  try {
    const data = await rekogClient.send(
      new SearchFacesByImageCommand({
        CollectionId: collectionName,
        Image: { Bytes: fs.readFileSync(imageName) },
      })
    );
    console.log("Faces indexed:");
    console.log(data.FaceMatches[0].Face.ExternalImageId);
    console.log(data.FaceMatches[0].Similarity);
  } catch (err) {
    console.log("Error", err.stack);
  }
};

//createCollection(collectionName);
saveImage(collectionName, "./deivid.jpeg", "647f83321043078fc1cf1ab7");
//findByImage(collectionName, "./edi2.jpeg");
