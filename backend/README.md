# API для работы с каналами (TypeScript)

Это REST API для управления списком каналов, написанный на Node.js с использованием Express, TypeScript и MySQL.

## Структура проекта

```
channels-api/
├── src/
│   ├── config/
│   │   └── db.ts            # Конфигурация подключения к базе данных
│   ├── controllers/
│   │   └── channels.ts      # Контроллеры для обработки запросов
│   ├── models/
│   │   └── channels.ts      # Модель для работы с данными каналов
│   ├── routes/
│   │   └── channels.ts      # Маршруты API
│   ├── types/
│   │   └── index.ts         # Типы и интерфейсы для TypeScript
│   └── server.ts            # Основной файл приложения
├── dist/                    # Скомпилированные JavaScript файлы
├── .env                     # Файл с переменными окружения
├── init-db.sql              # SQL скрипт для инициализации базы данных
├── package.json             # Метаданные проекта и зависимости
├── tsconfig.json            # Конфигурация TypeScript
└── README.md                # Документация проекта
```

## Установка и запуск

1. Клонируйте репозиторий:

```bash
git clone <url-репозитория>
cd channels-api
```

2. Установите зависимости:

```bash
npm install
```

3. Настройте базу данных:

   - Создайте базу данных MySQL
   - Импортируйте структуру из файла `init-db.sql`
   - Обновите данные подключения в файле `.env`

4. Компиляция TypeScript:

```bash
npm run build
```

5. Запустите сервер:

```bash
# Для обычного запуска
npm start

# Для разработки с автоматической перезагрузкой
npm run dev
```

6. Сервер будет доступен по адресу: `http://localhost:3000`

## API Endpoints

| Метод  | Путь              | Описание                     |
| ------ | ----------------- | ---------------------------- |
| GET    | /api/channels     | Получить список всех каналов |
| GET    | /api/channels/:id | Получить канал по ID         |
| POST   | /api/channels     | Создать новый канал          |
| PUT    | /api/channels/:id | Обновить существующий канал  |
| DELETE | /api/channels/:id | Удалить канал                |

### Примеры запросов

#### Получить все каналы

```
GET /api/channels
```

#### Создать новый канал

```
POST /api/channels
Content-Type: application/json

{
  "name": "Новый канал",
  "description": "Описание нового канала"
}
```

#### Обновить канал

```
PUT /api/channels/1
Content-Type: application/json

{
  "name": "Обновленный канал",
  "description": "Новое описание канала"
}
```

#### Удалить канал

```
DELETE /api/channels/1
```

## Технологии

- Node.js
- TypeScript
- Express.js
- MySQL
