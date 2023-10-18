const AWS = require("aws-sdk");

function uploadToS3(data, filename) {
    const BUCKET_NAME = "mytrackerapps";
    const IAM_USER_KEY = "AKIA2MTCAD7K2UNF4HNH";
    const IAM_USER_SECRET = "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";
  
    AWS.config.update({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });
    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read'
    };
  
    let s3Bucket = new AWS.S3();
  
    return new Promise((resolve, reject) => {
      s3Bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log("Something went wrong", err);
          reject(err);
        } else {
          console.log("File Successfully uploaded", s3response);
          resolve(s3response.Location);
        }
      });
    });
  }
module.exports ={
 uploadToS3

}  