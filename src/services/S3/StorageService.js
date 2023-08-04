const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3')

class StorageService {
  constructor () {
    this._S3 = new S3Client()
  }

  async writeFile (file, meta) {
    const key = +new Date() + meta.filename

    const parameter = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file._data,
      ContentType: meta.headers['content-type']
    })

    await this._S3.send(parameter)

    const bucketName = process.env.AWS_BUCKET_NAME
    const region = process.env.AWS_REGION
    const fileLocation = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`

    return fileLocation
  }
}

module.exports = StorageService
