import * as AWS from 'aws-sdk'
// @ts-ignore
import sharp = require('sharp');
import util = require('util');

const handler = async function (event: any) {
    //@ts-ignore
    const bucketName: string = process.env['BUCKET_NAME'];
    const s3 = new AWS.S3({apiVersion: "2006-03-01"})
    console.log(event);
    // Read options from the event parameter.
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    const bucket = bucketName
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

    // Infer the image type from the file suffix.
    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }

    // Check that the image type is supported
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "jpeg" && imageType != "png") {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    // Download the image from the S3 source bucket.

    try {
        const params = {
            Bucket: bucket,
            Key: srcKey
        };
        var originalImage = await s3.getObject(params).promise();
    } catch (error) {
        console.log(error);
        return;
    }

    // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
    const width  = 300;

    // Use the Sharp module to resize the image and save in a buffer.
    try {
        var buffer = await sharp(originalImage.Body).resize(width).toBuffer();
    } catch (error) {
        console.log(error);
        return;
    }
    const newKey = srcKey.replace('originals','thumbnails')
    // Upload the thumbnail image to the destination bucket
    try {
        const thumbnailParams = {
            Bucket: bucket,
            Key: newKey,
            Body: buffer,
            ContentType: "image"
        };
        const putResult = await s3.putObject(thumbnailParams).promise();
    } catch (error) {
        console.log(error);
        return;
    }

    console.log('Successfully resized ' + bucket + '/' + srcKey +
        ' and uploaded to ' + bucket + '/' + newKey);
};

export default handler;




