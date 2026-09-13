import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3Client = null;

export const getS3Client = () => {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

/**
 * Generates a temporary (presigned) GET URL for a private S3 object.
 * @param {string} fileKey - The S3 object key (e.g., 'uploads/...')
 * @param {number} expiresIn - Expiry time in seconds (default 1 hour)
 * @returns {Promise<string|null>} - The presigned URL
 */
export const getPresignedGetUrl = async (fileKey, expiresIn = 3600) => {
  if (!fileKey) return null;
  // If the key is somehow already a full URL (legacy), return it
  if (fileKey.startsWith("http")) return fileKey;

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
    });
    return await getSignedUrl(getS3Client(), command, { expiresIn });
  } catch (err) {
    console.error(`Failed to generate GET presigned URL for ${fileKey}:`, err);
    return null;
  }
};
