# CloudFormation

## Links

- [Create a lambda function using Cloudformation](https://www.youtube.com/watch?v=shS3B9Obxy0)
- [AWS::IAM::Role - Example](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-role.html#aws-resource-iam-role--examples)
- [AWS::LAMBDA::FUNCTION - Example](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html#aws-resource-lambda-function--examples)
  - [AWS::Lambda::Function Code](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html)
- [Chrome AWS Lambda Layer](https://github.com/shelfio/chrome-aws-lambda-layer)

## Role

- Default Config

  ```yaml
  AWSTemplateFormatVersion: "2010-09-09"
  Resources:
    RootRole:
      Type: "AWS::IAM::Role"
      Properties:
        AssumeRolePolicyDocument:
          Version: "2012-10-17"
          Statement:
            - Effect: Allow
              Principal:
                Service:
                  - ec2.amazonaws.com
              Action:
                - "sts:AssumeRole"
        Path: /
        Policies:
          - PolicyName: root
            PolicyDocument:
              Version: "2012-10-17"
              Statement:
                - Effect: Allow
                  Action: "*"
                  Resource: "*"
    RootInstanceProfile:
      Type: "AWS::IAM::InstanceProfile"
      Properties:
        Path: /
        Roles:
          - !Ref RootRole
  ```

### Custom Role

- Change `RootRole` to `MyLambdaRole`
- Update the service type from `ec2.amazonaws.com` to `lambda.amazonaws.com`
- Update policy name to `MyLambdaPolicy`
- Update policy action to use `s3:*`
- Remove `RootInstanceProfile` block
- Add `SQS` block

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Resources:
  MyLambdaRole:
    Type: "AWS::IAM::Role"
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              Service:
                - lambda.amazonaws.com
            Action:
              - "sts:AssumeRole"
      Path: /
      Policies:
        - PolicyName: MyLambdaPolicy
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action: "s3:*"
                Resource:
                  - "*"
              - Effect: Allow
                Action:
                  - "sqs:ReceiveMessage"
                  - "sqs:DeleteMessage"
                  - "sqs:GetQueueAttributes"
                Resource:
                  - "*"
```

- We could restrict policy

  ```yaml
  - PolicyName: MyLambdaPolicy
    PolicyDocument:
      Version: "2012-10-17"
      Statement:
        - Effect: Allow
          Action: "s3:*"
          Resource:
            - "arn:aws:s3:::pa-prepbox"
        - Effect: Allow
          Action:
            - "sqs:ReceiveMessage"
            - "sqs:DeleteMessage"
            - "sqs:GetQueueAttributes"
          Resource:
            - "arn:aws:sqs:us-east-1:030048144159:PrepBox"
  ```

## Lamda

- Default Config

  ```yaml
  AWSTemplateFormatVersion: "2010-09-09"
  Description: Lambda function ListBucketsCommand.
  Resources:
    primer:
      Type: AWS::Lambda::Function
      Properties:
        Runtime: nodejs18.x
        Role: arn:aws:iam::123456789012:role/lambda-role
        Handler: index.handler
        Code:
          ZipFile: |
            const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
            const s3 = new S3Client({ region: "us-east-1" }); // replace "us-east-1" with your AWS region

            exports.handler = async function(event) {
              const command = new ListBucketsCommand({});
              const response = await s3.send(command);
              return response.Buckets;
            };
        Description: List Amazon S3 buckets in us-east-1.
        TracingConfig:
          Mode: Active
  ```

### Inline Lambda

- Using the role that we just created, we can reference by using the `GetAtt`- Add `Role: !GetAtt MyLambdaRole`
- Add the tags:

  ```yaml
  Tags:
    - Key: Name
      Value: MyLambdaFunction
  ```

```yaml
MyLambdaFunction:
  Type: AWS::Lambda::Function
  Properties:
    Role: !GetAtt MyLambdaRole.Arn
    Runtime: nodejs18.x
    Handler: index.handler
    Code:
      ZipFile: |
        const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
        const s3 = new S3Client({ region: "us-east-1" }); // replace "us-east-1" with your AWS region

        exports.handler = async function(event) {
          const command = new ListBucketsCommand({});
          const response = await s3.send(command);
          return response.Buckets;
        };
    Tags:
      - Key: Name
        Value: MyLambdaFunction
```

### Zip File

- [AWS::Lambda::Function Code](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-code.html)

  ```yaml
  ImageUri: String
  S3Bucket: String
  S3Key: String
  S3ObjectVersion: String
  ZipFile: String
  ```

```yaml
MyLambdaFunction:
  Type: AWS::Lambda::Function
  Properties:
    Role: !GetAtt MyLambdaRole.Arn
    Runtime: nodejs18.x
    Handler: index.handler
    Code:
      S3Bucket: pa-lambda-files
      S3Key: pa-lambda-test.zip
    Tags:
      - Key: Name
        Value: MyLambdaFunction
```

arn:aws:lambda:us-east-1:030048144159:layer:node_v20-workbook_gen_part_1:1
arn:aws:lambda:us-east-1:030048144159:layer:node_v20-workbook_gen_part_2:1
arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:45
