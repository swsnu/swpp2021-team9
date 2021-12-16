aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 007159862944.dkr.ecr.ap-northeast-2.amazonaws.com
docker build -t lambda-pytorch-bandreco .
docker tag lambda-pytorch-bandreco:latest 007159862944.dkr.ecr.ap-northeast-2.amazonaws.com/lambda-pytorch-bandreco:latest
docker push 007159862944.dkr.ecr.ap-northeast-2.amazonaws.com/lambda-pytorch-bandreco:latest
