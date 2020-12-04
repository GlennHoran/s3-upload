import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Cdk from '../lib/cdk-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Cdk.CdkStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {"ghoranwebsitephotostorageD17E7B88": {
              "Type": "AWS::S3::Bucket",

              "Properties": {
                  "VersioningConfiguration": {
                      "Status": "Enabled"
                  }
              },
              "UpdateReplacePolicy": "Retain",
              "DeletionPolicy": "Retain"
          }
      }
    }, MatchStyle.EXACT))
});
