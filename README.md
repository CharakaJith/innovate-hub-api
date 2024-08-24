<div align="center">
  <h2 ="center">innovate-hub-api</h2>
</div>

## innovate-hub-api is a web API developed using Node.js, express and PostgreSQL. Its purpose is to facilitate CRUD (Create, Read, Update, Delete) operations on number of tables including user, product, meeting, productCategory, productMember and productTag.

The API follows RESTful principles and provides endpoints for each CRUD operation. It leverages PostgreSQL as the database management system to store data.

innovate-hub-api is designed to be efficient, scalable, and secure, providing a seamless experience for managing employee data in applications.

## Getting Started

### Prerequisites

- node.js: [Node.js download page](https://nodejs.org/en/download)
- PostgreSQL: [PostgreSQL download page](https://www.postgresql.org/download/)

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/CharakaJith/innovate-hub-api.git
   ```
2. Install NPM packages
    ```bash
   npm install
   ```
3. Create `.env` filr
    ```bash
   touch .env
   ```
4.  Enter following content in the `.env` file in the server
    ```bash
   # environment variables
    NODE_ENV=development
    PORT=8000

    # database configurations
    PG_USER=<DATABASE_USER>
    PG_PASSWORD=<USER_PASSWORD>
    PG_HOST=<DATABASE_HOST>
    PG_DATABASE=<DATABASE_NAME>
    PG_MAXCONN=150

    # defaults admin details
    ADMIN_NAME=<SAMPLE_NAME>
    ADMIN_EMAIL=<SAMPLE_EMAIL>
    ADMIN_PASSWORD=<RANDOM_PASSWORD>

    # jwt secret
    JWT_SECRET=<RANDOM_SECURE_STRING>

    # mailgun credentials
    DOMAIN=<MAILGUN_DOMAIN>
    API_KEY=<MAILGUN_API_KEY>
   ```

### Database setup

1. Create database tables
    ```bash
   npm run migrate:up
   ```
2. Populate with sample data
    ```bash
   npm run seed:up:all
   ```

### Start the server
1. Start server
    ```bash
   npm run start
   ```

## Documentations

- [Postman API Documentation](https://documenter.getpostman.com/view/28014836/2sAXjF8a2a)


## Contact
Email: [charaka.info@gmail.com](mailto:charaka.info@gmail.com) | LinkedIn: [Charaka Jith Gunasinghe](https://www.linkedin.com/in/charaka-gunasinghe-6742861b9/)