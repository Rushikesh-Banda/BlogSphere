# Blog App Backend

Backend API for MERN Blog Application.

## Features

- User Authentication
- JWT Authorization
- Create Articles
- Edit Articles
- Delete Articles
- MongoDB Database
- Cloudinary Image Upload

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Cloudinary

## Installation

### Clone repository

```bash
git clone <your-github-link>
```

### Install dependencies

```bash
npm install
```

## Run Server

```bash
npm start
```

## Environment Variables

Create `.env` file:

```env
PORT=4000
MONGO_URL=your_mongodb_url
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

## API Endpoints

### Auth Routes

- POST `/author-api/users`
- POST `/user-api/users`

### Article Routes

- POST `/author-api/articles`
- PUT `/author-api/articles`
- GET `/author-api/articles/:authorId`
- PATCH `/author-api/articles/:id/status`

## Author

Rushikesh