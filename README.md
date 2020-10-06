<h1 id='summary'>Summary</h1>

- [AWS LAMBDA FUNCTIONS](#aws-lambda-functions)
  - [Creating a New Lambda Function](#creating-a-new-lambda-function)
    - [Basic Information](#basic-information)
    - [Test Lambda Function](#test-lambda-function)
      - [Run Test](#run-test)
  - [CloudWatch](#cloudwatch)
    - [CloudWatch Roles/Permissions](#cloudwatch-rolespermissions)

# AWS LAMBDA FUNCTIONS

[Go Back to Summary](#summary)

- Login into your account and go to `https://console.aws.amazon.com/lambda/home?region=us-east-1#/begin`
- **ATTENTION** Notice that on the query string we have the region, choose the right region before doing anything

- Simple lambda function that prints "Hello from Lambda!" on the UI

  ```JavaScript
    exports.handler = async (event) => {
        console.log(event);
        return 'Hello from Lambda!';
    };
  ```

## Creating a New Lambda Function

[Go Back to Summary](#summary)

- On `AWS Lambda > Functions > Create Function`
- We have 3 options:

  ![](https://i.imgur.com/lH6LeHS.png)

  - **Author from scratch**
    - Start with a simple Hello World example.
  - **Use a blueprint**
    - Build a lambda application from sample code and configuration presets for common user cases
  - **Browse serverless app repository**
    - Deploy a sample Lambda application from the AWS Serverless Application Repository
    - In other words, use other people lambda functions

- In this case we are going to select **Use a blueprint**

  - Then search for `Hello`
  - Choose `hello-world-python`, then click on **Configure**

  ![](https://i.imgur.com/95UMgqS.png)

### Basic Information

[Go Back to Summary](#summary)

- On `Basic Information`

  - On **Function name**
    - Give a name to your lambda function (`hello-world`)
  - On **Execution role**
    - Choose `create a new role with basic Lambda permissions`
      - This permission allow us to: `Lambda will create an execution role named hello-world-role-7qvnovqs, with permission to upload logs to Amazon CloudWatch Logs.`
    - The role that is attached with our lambda function is an [IAM Role](https://console.aws.amazon.com/iam/home?#/roles$new?step=type), IAM role allows us to execute things on a lambda function. It tells what the lambda function can or cannot do, for example, interact with EC2.
  - After that is displayed a simple lambda function using **python**

    ```Python
      import json

      print('Loading function')


      def lambda_handler(event, context):
          #print("Received event: " + json.dumps(event, indent=2))
          print("value1 = " + event['key1'])
          print("value2 = " + event['key2'])
          print("value3 = " + event['key3'])
          return event['key1']  # Echo back the first key value
          #raise Exception('Something went wrong')
    ```

  - Then click on **Create function**

  ![](https://i.imgur.com/NqG86dP.png)

### Test Lambda Function

[Go Back to Summary](#summary)

- On `Lambada > Functions > hello-world`

  - We can test our lambda function, clicking on **Test** to create a new test event

  ![](https://i.imgur.com/wpHCaaY.png)

  - Configuring our test event
    - Select: `Create new test event`
    - Event Template: `hello-world`
    - Event name: Give a name to our test (`SimpleEvent`)
  - This will contain a **json** object with key/value pairs that we are going to use to invoke our lambda function.
  - Click on `Create`

  ![](https://i.imgur.com/Mw0Ph0g.png)

#### Run Test

[Go Back to Summary](#summary)

- Now that our event has been created
- On top right corner, choose our `SimpleEvent` and click on `Test`

  ![](https://i.imgur.com/pdgHytH.png)

- Check if our test was succeeded

  ![](https://i.imgur.com/kN9xphO.png)

- As we can see the **Log Output** is the output of our lambda function where we have `value1 = value1`, `value2 = value2`, and `value3 = value3`.

  ```Bash
    START RequestId: 525dc07b-e8da-4a43-b619-ec4db646eb97 Version: $LATEST
    value1 = value1
    value2 = value2
    value3 = value3
    END RequestId: 525dc07b-e8da-4a43-b619-ec4db646eb97
    REPORT RequestId: 525dc07b-e8da-4a43-b619-ec4db646eb97	Duration: 1.86 ms	Billed Duration: 100 ms	Memory Size: 128 MB	Max Memory Used: 49 MB
  ```

## CloudWatch

[Go Back to Summary](#summary)

- You can use Amazon [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html) to monitor, store, and access your log files from Amazon Elastic Compute Cloud (Amazon EC2) instances, AWS CloudTrail, Route 53, and other sources.
- CloudWatch Logs enables you to centralize the logs from all of your systems, applications, and AWS services that you use, in a single, highly scalable service. You can then easily view them, search them for specific error codes or patterns, filter them based on specific fields, or archive them securely for future analysis. CloudWatch Logs enables you to see all of your logs, regardless of their source, as a single and consistent flow of events ordered by time, and you can query them and sort them based on other dimensions, group them by specific fields, create custom computations with a powerful query language, and visualize log data in dashboards.

- Check logs on `CloudWatch`

  - On `CloudWatch > Logs > Log groups > /aws/lambda/hello-world`
  - Click on the `Log stream` to view the logs

  ![](https://i.imgur.com/dpY0u4v.png)
  ![](https://i.imgur.com/sawxKWu.png)

### CloudWatch Roles/Permissions

[Go Back to Summary](#summary)

- We can check the lambda function permissions on the tab `Permissions`
- then click on the name of our lambda function `hello-world-role-7qvnovqs`

  ![](https://i.imgur.com/j4568pW.png)

- To view the permissions applied to our lambda function, click on the `Policy name`
  ![](https://i.imgur.com/fy6BV5e.png)

- Then click on `{} JSON`
  ![](https://i.imgur.com/hdrLNE2.png)
  ![](https://i.imgur.com/GPJRNSK.png)

  - From this rule we can see 2 things:
    - `"Action": "logs:CreateLogGroup",` allows us to create the log group
      - `/aws/lambda/hello-world`
    - then the
      ```JSON
        "Action": [
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
      ```
    - Allow us to create a Log Stream and put The log stream into the log group that we created
      ```JSON
        "Resource": [
            "arn:aws:logs:us-east-1:514288698548:log-group:/aws/lambda/hello-world:*"
        ]
      ```
