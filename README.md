# Workforce Social Network

A modern, enterprise-grade social network platform designed for workforce collaboration, communication, and productivity tracking.

## Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with role-based access control
- **News Feed**: Post updates, share ideas, and interact with colleagues
- **Real-time Messaging**: Instant chat with Socket.io for real-time communication
- **Task Management**: Create, assign, and track tasks with status updates
- **Employee Profiles**: Comprehensive user profiles with performance metrics
- **Search**: Global search across users, posts, and tasks
- **Admin Panel**: Dashboard for managing users, content, and analytics

### Technical Features
- **Frontend**: React 18 with Vite, TailwindCSS, React Router, React Query
- **Backend**: Node.js with Express, MongoDB, Socket.io
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Uploads**: AWS S3 integration for avatars and attachments
- **Caching**: Redis for improved performance
- **Email Notifications**: Nodemailer for user notifications

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router v6
- TanStack Query (React Query)
- Socket.io Client
- Axios
- React Icons
- React Toastify
- Date-fns

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT for authentication
- Bcrypt for password hashing
- AWS SDK for S3
- Redis for caching
- Nodemailer for emails

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB
- Redis (optional, for caching)
- AWS S3 account (optional, for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IA1
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   **Backend** - Create `backend/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000

   # Database
   MONGODB_URI=mongodb://localhost:27017/workforce-social-network

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d

   # AWS S3 (optional)
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=workforce-uploads

   # Redis (optional)
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # Email (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
   EMAIL_FROM=noreply@workforce.com
   ```

   **Frontend** - Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start Redis** (optional)
   ```bash
   redis-server
   ```

3. **Start backend server**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `GET /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user (admin/manager)
- `DELETE /api/users/:id` - Delete user (admin)
- `PUT /api/users/:id/avatar` - Upload avatar
- `GET /api/users/:id/metrics` - Get user performance metrics

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Like/unlike post
- `PUT /api/posts/:id/share` - Share post

### Comments
- `GET /api/posts/:postId/comments` - Get comments for post
- `POST /api/posts/:postId/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `PUT /api/comments/:id/like` - Like/unlike comment

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `POST /api/messages/conversations` - Create conversation
- `GET /api/messages/:conversationId` - Get messages
- `POST /api/messages` - Send message
- `DELETE /api/messages/:id` - Delete message

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users (admin view)
- `PUT /api/admin/users/:id/status` - Toggle user status
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/posts` - Get all posts (moderation)
- `DELETE /api/admin/posts/:id` - Delete post (moderation)
- `GET /api/admin/performance` - Get performance report

### Search
- `GET /api/search?q={query}` - Global search
- `GET /api/search/users?q={query}` - Search users

## Deployment

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   cd backend
   heroku create workforce-social-network-api
   ```

4. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   heroku config:set MONGODB_URI=your-mongodb-uri
   # Set other environment variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Netlify/Vercel)

**Netlify:**
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
cd frontend
vercel --prod
```

### Docker Deployment

1. **Build images**
   ```bash
   docker-compose build
   ```

2. **Run containers**
   ```bash
   docker-compose up -d
   ```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Project Structure

```
workforce-social-network/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── socket/         # Socket.io setup
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions workflow
└── README.md
```

## Security Features

- **Authentication**: JWT-based with secure password hashing (bcrypt)
- **Authorization**: Role-based access control (employee, manager, admin)
- **Input Validation**: Server-side validation with express-validator
- **XSS Protection**: Helmet middleware for security headers
- **CORS**: Configured for specific origins
- **Rate Limiting**: Protection against brute force attacks
- **SQL Injection**: MongoDB parameterized queries
- **HTTPS**: Recommended for production

## Performance Optimization

- **Code Splitting**: Lazy loading of React components
- **Caching**: Redis for frequently accessed data
- **Pagination**: Implemented for all list endpoints
- **Image Optimization**: Lazy loading and compression
- **Database Indexing**: Optimized MongoDB queries
- **Bundle Optimization**: Vite for efficient bundling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@workforce.com or open an issue in the repository.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Calendar integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] AI-powered recommendations

---

**Built with ❤️ for enterprise teams**
