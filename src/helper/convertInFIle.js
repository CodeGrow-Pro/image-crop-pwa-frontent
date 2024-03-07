async function convertBlobUrlToFile(blobUrl, fileName) {
    // Fetch the Blob content
    const response = await fetch(blobUrl);
    const blobData = await response.blob();

    // Create a File object with the Blob content
    const file = new File([blobData], fileName, { type: blobData.type });

    return file;
}

export default convertBlobUrlToFile