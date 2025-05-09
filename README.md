# DBT Journey - Gamified Learning Platform

A gamified learning application for Dialectical Behavior Therapy (DBT) skills built with TypeScript, React, Vite, Express, Prisma, and PostgreSQL.

## Features

- 🎮 **Gamified Learning Experience**: Learn DBT skills through interactive modules with points, achievements, and levels
- 🧠 **Comprehensive DBT Content**: Covers core DBT modules: Mindfulness, Distress Tolerance, Emotion Regulation, and Interpersonal Effectiveness
- 🏆 **Achievement System**: Earn badges and track progress as you learn and practice skills
- 🎯 **Interactive Challenges**: Quizzes, reflections, guided meditations, practice exercises and scenario-based learning
- 🔐 **User Authentication**: Secure login/registration system with JWT
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop with Tailwind CSS

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/dbternow.git
   cd dbternow
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://postgres:kqdYQCEzIKOyJVjwLikoiZnizPMHSiEE@maglev.proxy.rlwy.net:11447/railway"
   JWT_SECRET="your_jwt_secret_key"
   ```

4. Set up the database
   ```bash
   # Create and apply migrations
   npm run db:migrate
   
   # Seed the database with initial data
   npm run db:seed
   ```

5. Start the development servers
   ```bash
   # Start both frontend and backend in development mode
   npm start
   
   # Or separately:
   npm run dev        # Frontend (Vite)
   npm run dev:server # Backend (Express)
   ```

6. Access the application
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - Prisma Studio (DB explorer): [http://localhost:5555](http://localhost:5555) (Run with `npm run db:studio`)

### Default User Credentials

- Admin User:
  - Email: admin@example.com
  - Password: admin123

- Regular User:
  - Email: user@example.com
  - Password: user123

## Project Structure

```
dbternow/
├── prisma/               # Prisma schema & migrations
├── server/               # Backend Express server
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   └── server.ts         # Server entry point
├── src/                  # Frontend React application
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   └── types/            # TypeScript type definitions
├── .env                  # Environment variables
└── package.json          # Project dependencies and scripts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- DBT content and concepts are based on the work of Dr. Marsha Linehan
- The application is created for educational purposes
