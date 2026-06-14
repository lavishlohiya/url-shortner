# URL Shortener API

A RESTful URL Shortener API built with Node.js, Express, PostgreSQL, JWT Authentication, and AJV Validation.

## Features

- User Registration
- User Login
- JWT Authentication
- Create Short URLs
- Redirect Short URLs
- Track Click Counts
- Get URL Analytics
- Update URLs
- Delete URLs
- Update User Email
- Delete User Account
- Request Validation with AJV

## Tech Stack

# URL Shortener API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![AJV](https://img.shields.io/badge/AJV-23C8D2?style=for-the-badge)
![bcrypt](https://img.shields.io/badge/bcrypt-FF6F00?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Project Structure

```text
server.js
src/
├── app.js
├── controllers/
├── middlewares/
├── routes/
|── config/
|── services/
|── validators/
```



## Installation

### Clone Repository

```bash
git clone https://github.com/lavishlohiya/url-shortner.git
cd url-shortner
```

### Install Dependencies

```bash
npm install
```

### Create Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgresql_connection_string

JWT_SECRET=your_secret_key
```

### Run Server

```bash
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| PATCH | /api/users/email | Update Email |
| DELETE | /api/users | Delete Account |

### URLs

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/urls | Create Short URL |
| GET | /api/urls | Get All URLs |
| GET | /api/urls/:id | Redirect URL |
| GET | /api/urls/stats/:shortId | URL Analytics |
| PATCH | /api/urls/:shortId | Update URL |
| DELETE | /api/urls/:shortId | Delete URL |


## Database Schema

### Users

| Column | Type |
|----------|----------|
| id | SERIAL |
| email | VARCHAR |
| password | TEXT |

### URLs

| Column | Type |
|----------|----------|
| id | SERIAL |
| user_id | INTEGER |
| original_url | TEXT |
| short_id | TEXT |
| click_count | INTEGER |
| created_at | TIMESTAMP |

## Future Improvements

- Frontend Dashboard
- Custom Short URLs
- Rate Limiting
- Docker Support

## License

This project is licensed under the MIT License.

## Author

Lavish Lohiya
