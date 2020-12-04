import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'ghoran-photo-storage', {
      versioned: true
    });
    new s3.Bucket(this, 'ghoran-website-photo-upload', {
      versioned: true,
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });
  }
}
