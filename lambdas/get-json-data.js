import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
const s3 = new S3Client({ region: "eu-north-1" });
const BUCKET_NAME = "your bucket name";

//Convert S3 stream data to a string
const streamToString = async (stream) => {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
};

export const handler = async (event) => {
    const { fileKey } = event.pathParameters; // Retrieve fileKey from path parameters

    try {
        const getObjectResponse = await s3.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fileKey }));
        const bodyContents = await streamToString(getObjectResponse.Body);

        return {
            statusCode: 200,
            body: bodyContents,
        };
    } catch (error) {
        console.error("Error in GET Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to retrieve data", error: error.message }),
        };
    }
};
