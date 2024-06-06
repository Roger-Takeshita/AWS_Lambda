const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: 'us-east-1' });

exports.handler = async function (event) {
    const command = new ListBucketsCommand({});
    const response = await s3.send(command);
    return response.Buckets;
};
