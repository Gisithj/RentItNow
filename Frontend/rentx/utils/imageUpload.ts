import { BlobServiceClient } from '@azure/storage-blob';

const uploadImageToAzure = async (file:File) => {
  // Replace with your Azure Storage account connection string
  
  const connectionString = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME;

  const blobServiceClient = new BlobServiceClient(connectionString!);
  const containerClient = blobServiceClient.getContainerClient(containerName!);

  const blobClient = containerClient.getBlockBlobClient(file.name);
  const options = { blobHTTPHeaders: { blobContentType: file.type } };
  await blobClient.uploadData(file, options);

  return blobClient.url;
};

export const handleUpload = async (files: File[]): Promise<string[]> => {
    const urls = await Promise.all(files.map((file: File) => uploadImageToAzure(file)));
    return urls;
  };