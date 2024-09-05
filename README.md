# AI-BLOG API

This is the Backend service for a blogging application **AI BLOG**

# Getting Started

This project is built with Node.js, PostgreSQL, and TypeScript, using Yarn as the package manager. Follow these instructions to set up the project locally.

## Prerequisites

- Node.js (v18 or later recommended)
- Yarn package manager
- PostgreSQL (v12 or later recommended)
- Docker (optional, for containerized setup)

## Setup

### Option 1: Local Setup

1. Clone the repository:

```
git clone https://github.com/Tee-Stark/ai-assessment-blog-api
```

2. Install dependencies:

```
yarn
```

3. Set up your PostgreSQL database and create a `.env` file in the project root with your database configuration

4. Run database migrations:

```
yarn migrate
```

5. Start the development server:

```
yarn start:dev
```

The server should now be running on `http://localhost:3000` (or your configured port).

### Option 2: Docker Setup

If you prefer using Docker, follow these steps:

1. Make sure you have Docker and Docker Compose installed on your machine.

2. Clone the repository:

```
git clone https://github.com/Tee-Stark/ai-assessment-blog-api
```

## Some Scalability Considerations

- Deploy App in a region in EU. considering that requests mostly come from europe
-

## API Documentation

https://documenter.getpostman.com/view/15116113/2sAXjQ2VsN
