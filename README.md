# MetaBand [![Build Status](https://travis-ci.com/swsnu/swpp2021-team9.svg?branch=main)](https://travis-ci.com/swsnu/swpp2021-team9) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swsnu_swpp2021-team9&metric=alert_status)](https://sonarcloud.io/dashboard?id=swsnu_swpp2021-team9) [![Coverage Status](https://coveralls.io/repos/github/swsnu/swpp2021-team9/badge.svg?branch=main)](https://coveralls.io/github/swsnu/swpp2021-team9?branch=main)

In MetaBand, people can create **_band cover contents_** regardless of time and space. A **_cover_** is a performance of an existing song by other vocalists/instrumentalists. In MetaBand, you can **_record & upload_** song covers and **_listen_** to other people's covers.

MetaBand specializes in connectivity between covers. Among the covers of a particular song,

1) Anyone can listen to combinations of any covers simultaneously, and
2) Anyone can record/upload their own cover while listening to that combination.

For example, `guitarist G` may add guitar lines while listening to `vocalist V`'s vocals and `drummer D`'s drums. Another `vocalist V2` may hear `G`'s guitars and record their own vocals to it. These kinds of interactions make it possible to have limitless amount of **_cover combinations_**. A combination of covers is called a **_MetaBand_** (metaverse + band), since it is essentially a band formed virtually.

MetaBand aims to be a place for people of any musical background, where one can musically connect with others without any constraints of offline meetings.

---

### Read [Our Wiki](https://github.com/swsnu/swpp2021-team9/wiki)

---

## Instructions

### Installation
```shell
source ~/virtualenv/python3.7/bin/activate
pip install -r backend/requirements.txt
cd frontend
yarn install
cd ..
```

### Frontend Running
```shell
cd frontend
yarn start
```

### Backend Running
```shell
cd backend/app
python manage.py migrate
python manage.py runserver
```

### Frontend Testing
```shell
cd frontend
yarn test --coverage --watchAll=false
```

### Backend Testing
```shell
cd backend/app
coverage run --source='.' manage.py test
coverage xml
```