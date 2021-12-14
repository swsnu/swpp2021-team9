#!/bin/sh
 
echo "Start Sever (entry_point)"
start=`date +%s`
if [ "$DATABASE" = "mysql" ]
then
    echo "Waiting for mysql..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "mysql started"
fi
end=`date +%s`
echo "starting time was `expr $end - $start` s. "
python3 manage.py migrate --noinput
exec "$@"