# lambda-pytorch-bandreco

- app/app.py - Code for the application's Lambda function including the code for ML inferencing.
- app/Dockerfile - The Dockerfile to build the container image.
- app/model - A Resnet PyTorch model for feature get model from music genre classifier
- app/requirements.txt - The pip requirements to be installed during the container build.
- events - A sample events
- template.yaml - A template that defines the application's AWS resources.
- trainer.ipynb - A jupyter notebook to show the training process.

## Deploy the sample application

You need this.
* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

You may need the following for local testing.
* [Python 3 installed](https://www.python.org/downloads/)

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

## Use the SAM CLI to build and test locally

Build your application with the `sam build` command.

```bash
lambda-pytorch-bandreco$ sam build
```

The SAM CLI builds a docker image from a Dockerfile and then installs dependencies defined in `app/requirements.txt` inside the docker image. The processed template file is saved in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
lambda-pytorch-bandreco$ sam local invoke InferenceFunction --event events/event.json
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
lambda-pytorch-bandreco$ sam local start-api
lambda-pytorch-bandreco$ curl http://localhost:3000/classify_digit
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        Inference:
          Type: Api
          Properties:
            Path: /classify_digit
            Method: post
```

## Upload
```
aws ecr get-login-password --region <aws-region> | docker login --username AWS --password-stdin <your ecr>.<aws-region>.amazonaws.com
cd app
docker build -t lambda-pytorch-bandreco .
docker tag lambda-pytorch-bandreco:latest  <your ecr>.<aws-region>.amazonaws.com/lambda-pytorch-bandreco:latest
docker push <your ecr>.<aws-region>.amazonaws.com/lambda-pytorch-bandreco:latest
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
