const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: 'us-east-1' });

const uploadFileOnS3 = async ({ bucketName, data, filename }) => {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filename,
        Body: JSON.stringify(data, null, 4),
    });

    try {
        const response = await s3.send(command);
        console.log(response);
        return response;
    } catch (err) {
        console.error(err);
    }
};

exports.handler = async function () {
    const data = {
        firstName: 'Roger',
        lastName: 'Takeshita',
    };

    const response = await uploadFileOnS3({
        bucketName: 'pa-lambda-files',
        data,
        filename: 'test.json',
    });

    return response;
};
