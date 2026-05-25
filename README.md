# Devlytic

An AI-powered developer hiring marketplace that connects developers with companies through intelligent job matching.

## Features

- Dual role authentication — Developer & Company (JWT + refresh tokens)
- AI match scoring — Anthropic API scores developer fit for each role
- Developer profiles — skills, availability, resume and portfolio links
- Job board with filters — job type, work mode, location, skills
- My Jobs — saved, applied, interviews and archived tabs
- Real-time notifications via WebSockets
- Paystack-gated featured job listings
- Cloudinary file uploads — avatars, logos, resumes
- Welcome emails via Nodemailer
- Fully responsive — sidebar on desktop, bottom nav on mobile

## Tech Stack

**Frontend:** React 18, React Router v6, Redux Toolkit, Tailwind CSS, Axios, Formik, Yup, Lucide React

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Nodemailer, Cloudinary, Paystack

## Live Demo

[devlytic.vercel.app](https://devlytic.vercel.app)

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Gmail account with App Password

### Backend Setup
```bash
cd devlytic-server
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

### Frontend Setup
```bash
cd devlytic-client
npm install
cp .env.example .env
# Fill in your environment variables
npm run dev
```

## Environment Variables

### Server

PORT=5000
MONGO_URI=your_example
JWT_ACCESS_SECRET=your_example
JWT_REFRESH_SECRET=your_example
CLIENT_URL=your_example
CLOUDINARY_CLOUD_NAME=your_example
CLOUDINARY_API_KEY=your_example
CLOUDINARY_API_SECRET=your_example
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_example
MAIL_PASS=your_example
MAIL_FROM=your_example
ANTHROPIC_API_KEY=your_example


### Client

VITE_API_URL=www.example.com

## Author

Cynthia Omisore — [cynthiaomisore.vercel.app](https://cynthiaomisore.vercel.app)