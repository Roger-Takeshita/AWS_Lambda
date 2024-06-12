const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client } = require('@aws-sdk/client-s3');
const fs = require('fs');

const uploadStreamToS3 = async ({ path, filename, bucketName }) => {
    const readStream = fs.createReadStream(path);
    const params = {
        Bucket: bucketName,
        Key: filename,
        Body: readStream,
    };

    const parallelUploads3 = new Upload({
        client: new S3Client({ region: 'us-east-1' }),
        tags: [],
        queueSize: 4,
        leavePartsOnError: false,
        params,
    });

    parallelUploads3.on('httpUploadProgress', (progress) => {
        console.log(progress);
    });

    await parallelUploads3.done();
};

exports.handler = async function () {
    const readStream = fs.createReadStream('./Rubiks.pdf');
    const params = {
        Bucket: 'pa-lambda-files',
        Key: 'Rubiks_Uploaed.pdf',
        Body: readStream,
    };

    try {
        const parallelUploads3 = new Upload({
            client: new S3Client({ region: 'us-east-1' }),
            tags: [],
            queueSize: 4,
            leavePartsOnError: false,
            params,
        });

        parallelUploads3.on('httpUploadProgress', (progress) => {
            console.log(progress);
        });

        await parallelUploads3.done();

        return {
            statusCode: 200,
            body: 'Upload finished successfuly',
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: e.message,
        };
    }
};
