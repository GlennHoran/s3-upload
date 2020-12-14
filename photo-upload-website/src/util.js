
//cleaves off "URL = " at the start of URL that's returned from lambda.
export const formatUrl = (unformattedUrl ) => {
    return unformattedUrl.substr(6)
}

export const renameFile = (originalFile, newName) => {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}