<code>docker-compose down -v</code>
<code>docker stop adminer</code> - остановить контейнер с adminer  
<code>docker rm adminer</code> - остановить контейнер с adminer  
<code>docker stop mysql-db</code> - остановить контейнер с БД  
<code>docker rm mysql-db</code> - удалить существующий контейнер с БД  

# Запуск для разработки

1. <code>npm run start:db</code>
2. <code>npm run start:backend</code>
3. <code>npm run start:frontend</code>

Или запуск всего сразу <code>npm run dev</code>

# Доступ к тестовой БД

Создать .env в папке backend

```
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=mydb
PORT=3000
```

# GUI-клиент
После запуска всех сервисов, по адресу localhost:8080 доступен adminer

Движок - MySQL/MariaDB  
Сервер - mysql  
Имя пользователя - user  
Пароль - password  
База данных - mydb  

