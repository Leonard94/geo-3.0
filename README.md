docker stop adminer - остановить контейнер с adminer
docker rm adminer - остановить контейнер с adminer
docker stop mysql-db - остановить контейнер с БД
docker rm mysql-db - удалить существующий контейнер с БД

# Запуск для разработки
1. npm run start:db
2. npm run start:backend
3. npm run start:frontend

Или запуск всего сразу npm run dev

# Доступ к тестовой БД
Создать .env в папке backend

DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=mydb
PORT=3000