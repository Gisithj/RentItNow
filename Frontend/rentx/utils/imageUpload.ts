// import { BlobServiceClient } from '@azure/storage-blob';

// const uploadImageToAzure = async (file:File) => {
//   // Replace with your Azure Storage account connection string
  
//   const connectionString = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING;
//   const containerName = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME;

//   const blobServiceClient = new BlobServiceClient(connectionString!);
//   const containerClient = blobServiceClient.getContainerClient(containerName!);

//   const blobClient = containerClient.getBlockBlobClient(file.name);
//   const options = { blobHTTPHeaders: { blobContentType: file.type } };
//   await blobClient.uploadData(file, options);
//   console.log("uploaded",blobClient);
  
//   return blobClient.url;
// };

// export const handleUpload = async (files: File[]): Promise<string[]> => {
//     const urls = await Promise.all(files.map((file: File) => uploadImageToAzure(file)));
//     return urls;
//   };
import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';

const getBlobServiceClient = () => {
  const connectionString = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING;
  return BlobServiceClient.fromConnectionString(connectionString!);
};

const getUniqueFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop();
  const baseName = fileName.replace(`.${extension}`, '');
  const timestamp = new Date().getTime();
  return `${baseName}_${timestamp}.${extension}`;
};

const uploadImageToAzure = async (file: File, containerClient: ContainerClient): Promise<string> => {
  const blobName = getUniqueFileName(file.name);
  const blobClient = containerClient.getBlockBlobClient(blobName);
  
  const options = { 
    blobHTTPHeaders: { blobContentType: file.type }
  };

  await blobClient.uploadData(file, options);
  console.log("uploaded", blobClient);

  return blobClient.url;
};

export const uploadSingleFile = async (file: File): Promise<string> => {
  const blobServiceClient = getBlobServiceClient();
  const containerName = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME;
  const containerClient = blobServiceClient.getContainerClient(containerName!);

  try {
    const url = await uploadImageToAzure(file, containerClient);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
  const blobServiceClient = getBlobServiceClient();
  const containerName = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME;
  const containerClient = blobServiceClient.getContainerClient(containerName!);

  try {
    const urls = await Promise.all(files.map(file => uploadImageToAzure(file, containerClient)));
    return urls;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};

export const handleUpload = async (files: File | File[]): Promise<string | string[]> => {
  if (Array.isArray(files)) {
    return uploadMultipleFiles(files);
  } else {
    return uploadSingleFile(files);
  }
};