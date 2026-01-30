# SocialPulse Backend API

A comprehensive backend API for the SocialPulse social media management platform, built with Node.js, Express, TypeScript, and Prisma.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Real-time Communication**: Socket.IO for live updates and notifications
- **Database Management**: Prisma ORM with PostgreSQL
- **Caching**: Redis for performance optimization
- **File Storage**: AWS S3 integration for media uploads
- **Social Platform Integration**: Meta, Twitter, LinkedIn, Instagram, TikTok, YouTube APIs
- **Team Collaboration**: Multi-user team management and permissions
- **Content Management**: Media library with folders and organization
- **Campaign Management**: Organize posts into marketing campaigns
- **Analytics**: Comprehensive social media performance tracking
- **Notifications**: Real-time notifications and alerts
- **Email Services**: Automated email notifications and communications

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Real-time**: Socket.IO
- **File Storage**: AWS S3
- **Authentication**: JWT with bcrypt
- **Validation**: Express Validator
- **Email**: Nodemailer
- **AI**: OpenAI API integration
- **Process Management**: PM2
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL
- Redis
- AWS S3 account (for file storage)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

5. Update the `.env` file with your configuration

6. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Request password reset
- `PUT /api/v1/auth/reset-password/:token` - Reset password
- `PUT /api/v1/auth/update-password` - Update password
- `GET /api/v1/auth/me` - Get current user

### User Management

- `GET /api/v1/users` - Get all users (admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin)
- `GET /api/v1/users/:id/stats` - Get user statistics
- `GET /api/v1/users/:id/team-members` - Get user's team members

### Post Management

- `GET /api/v1/posts` - Get all posts
- `GET /api/v1/posts/:id` - Get post by ID
- `POST /api/v1/posts` - Create new post
- `PUT /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post
- `POST /api/v1/posts/:id/publish` - Publish post
- `GET /api/v1/posts/:id/analytics` - Get post analytics

### Analytics

- `GET /api/v1/analytics/overview` - Get analytics overview
- `GET /api/v1/analytics/platforms/:platform` - Get platform analytics
- `GET /api/v1/analytics/posts/performance` - Get post performance
- `GET /api/v1/analytics/audience` - Get audience analytics
- `GET /api/v1/analytics/growth` - Get growth metrics

### Platform Integration

- `GET /api/v1/platforms/available` - Get available platforms
- `GET /api/v1/platforms/connections` - Get platform connections
- `POST /api/v1/platforms/connect` - Connect to platform
- `PUT /api/v1/platforms/connections/:id` - Update connection
- `DELETE /api/v1/platforms/connections/:id` - Disconnect platform
- `POST /api/v1/platforms/sync/:id` - Sync platform data
- `GET /api/v1/platforms/:platform/account` - Get platform account info

### Team Management

- `GET /api/v1/teams/my-team` - Get user's team
- `POST /api/v1/teams` - Create new team
- `PUT /api/v1/teams/:id` - Update team
- `POST /api/v1/teams/:id/invite` - Invite user to team
- `POST /api/v1/teams/invitations/:id/accept` - Accept invitation
- `POST /api/v1/teams/invitations/:id/decline` - Decline invitation
- `DELETE /api/v1/teams/:id/members/:memberId` - Remove team member
- `POST /api/v1/teams/:id/leave` - Leave team
- `GET /api/v1/teams/invitations` - Get team invitations
- `GET /api/v1/teams/:id/stats` - Get team statistics

### Content Management

- `GET /api/v1/content` - Get content library
- `POST /api/v1/content/upload` - Upload content
- `PUT /api/v1/content/:id` - Update content
- `DELETE /api/v1/content/:id` - Delete content
- `GET /api/v1/content/folders` - Get content folders
- `POST /api/v1/content/folders` - Create folder
- `PUT /api/v1/content/folders/:id` - Update folder
- `DELETE /api/v1/content/folders/:id` - Delete folder
- `GET /api/v1/content/stats` - Get content statistics

### Campaign Management

- `GET /api/v1/campaigns` - Get all campaigns
- `GET /api/v1/campaigns/:id` - Get campaign by ID
- `POST /api/v1/campaigns` - Create new campaign
- `PUT /api/v1/campaigns/:id` - Update campaign
- `DELETE /api/v1/campaigns/:id` - Delete campaign
- `GET /api/v1/campaigns/:id/analytics` - Get campaign analytics
- `POST /api/v1/campaigns/:id/posts` - Add post to campaign
- `DELETE /api/v1/campaigns/:id/posts/:postId` - Remove post from campaign

### Notifications

- `GET /api/v1/notifications` - Get notifications
- `GET /api/v1/notifications/:id` - Get notification by ID
- `POST /api/v1/notifications` - Create notification
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `PUT /api/v1/notifications/read-all` - Mark all as read
- `DELETE /api/v1/notifications/:id` - Delete notification
- `GET /api/v1/notifications/stats` - Get notification statistics
- `POST /api/v1/notifications/bulk` - Send bulk notifications

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts and profiles
- **Team**: Team management and collaboration
- **Post**: Social media posts and scheduling
- **PlatformConnection**: Social platform integrations
- **Analytics**: Performance metrics and insights
- **Content**: Media library management
- **Campaign**: Marketing campaign organization
- **Notification**: Real-time notifications

## Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t socialpulse-backend .
docker run -p 5000:5000 socialpulse-backend
```

### PM2

```bash
npm run pm2:start
npm run pm2:stop
npm run pm2:restart
```

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.