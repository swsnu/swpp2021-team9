# backend/Dockerfile
FROM python:3.7

VOLUME /srv/
WORKDIR /srv/

RUN apt-get -y update
RUN apt-get install -y netcat default-libmysqlclient-dev

COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install uwsgi

# COPY ./app .

# COPY ./entrypoint.sh /app/entrypoint.sh
# run entrypoint.sh
WORKDIR /srv/app/
ENTRYPOINT ["/srv/entrypoint.sh"]