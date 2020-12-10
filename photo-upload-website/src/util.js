
//cleaves off "URL = " at the start of URL that's returned from lambda.
export const formatUrl = (unformattedUrl ) => {
    return unformattedUrl.substr(6)
}

