FROM public.ecr.aws/a1p3q7r0/alpine:3.12.0 as ffmpeg-builder
RUN cd /usr/local/bin && \
    mkdir ffmpeg && \
    cd ffmpeg/ && \
    wget https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz && \
    tar xvf *.tar.xz && \
    rm -f *.tar.xz && \
    mv ffmpeg-git-*-amd64-static/* .

FROM public.ecr.aws/lambda/python:3.8

RUN yum install -y libsndfile

COPY requirements.txt ./
COPY model.pth /opt/ml/model.pth

RUN python3.8 -m pip install -r requirements.txt -t .


COPY --from=ffmpeg-builder /usr/local/bin/ffmpeg/* /usr/local/bin/
COPY FE.py preprocessor.py app.py utils.py collecter.py ./
ENV NUMBA_CACHE_DIR=/tmp

CMD ["app.lambda_handler"]
