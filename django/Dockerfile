# pull official base image
FROM python:3.9-buster

# set work directory
WORKDIR /usr/src/django

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apt-get update && apt-get -y upgrade && apt-get install -y netcat

# RUN apt-get install postgresql
# RUN apk add postgresql-dev gcc musl-dev python3-dev py3-numpy py-pip py3-pandas@community

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/django/entrypoint.sh
RUN chmod +x /usr/src/django/entrypoint.sh

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/usr/src/django/entrypoint.sh"]