import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Constants
const API_ID = "your-api-id"; // Replace with your actual API Gateway ID
const AWS_REGION = "eu-north-1";
const BUCKET_NAME = "your json bucket name";

// Initialize S3 client
const s3 = new S3Client({ region: AWS_REGION });

// Function to generate a UUID
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const handler = async (event) => {
    try {
        const data = JSON.parse(event.body); // Parse incoming JSON data

        // Generate a unique file key
        const fileKey = `${generateUUID()}.json`;

        // S3 put command parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileKey,
            Body: JSON.stringify(data),
            ContentType: "application/json",
        };

        // Store data in S3
        const putResult = await s3.send(new PutObjectCommand(params));

        // Generate a pre-signed URL for secure access to the stored object (optional)
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
        }), { expiresIn: 900 }); // URL expires in 15 minutes

        // API Gateway URL for accessing the Lambda function
        const apiGatewayUrl = `https://${API_ID}.execute-api.${AWS_REGION}.amazonaws.com/prod/json-data/${fileKey}`;

        // Return e_tag and signed URL
        return {
            statusCode: 200,
            body: JSON.stringify({
                e_tag: putResult.ETag,
                s3SignedUrl: signedUrl // Pre-signed S3 URL for file access
            }),
        };
    } catch (error) {
        console.error("Error in POST Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to store data", error: error.message }),
        };
    }
};