#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
        sleep 0.1
    done


    echo "PostgreSQL started"
fi

# run migrations as admin superuser
export SQL_USER=$POSTGRES_USER
export SQL_PASSWORD=$POSTGRES_PASSWORD
echo $SQL_USER
python manage.py makemigrations && python manage.py migrate

# start up container as readonly user
export SQL_USER=$READONLY_USER
export SQL_PASSWORD=$READONLY_PASSWORD
echo $SQL_USER

exec "$@"
