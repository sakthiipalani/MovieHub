# Movie Hub - MERN Stack Application

## Project Overview

A full-stack movie browsing application built with the MERN stack (MongoDB, Express.js, React, Node.js). Users can browse movies, view details, read/write reviews, and administrators can manage the movie database.

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with cookies

### Frontend
- **Framework**: React 18+ with Vite
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Notifications**: React Toastify

---

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### User Routes (`/users`)

| Method | Endpoint | Auth | Description |
|--------|-----------|------|-------------|
| POST | `/` | Public | Register new user |
| POST | `/auth` | Public | Login user |
| POST | `/logout` | Public | Logout user |
| GET | `/` | Admin | Get all users |
| GET | `/profile` | Private | Get current user profile |
| PUT | `/profile` | Private | Update current user profile |

### Genre Routes (`/genre`)

| Method | Endpoint | Auth | Description |
|--------|-----------|------|-------------|
| GET | `/genres` | Public | List all genres |
| GET | `/:id` | Public | Get single genre |
| POST | `/` | Admin | Create new genre |
| PUT | `/:id` | Admin | Update genre |
| DELETE | `/:id` | Admin | Delete genre |

### Movie Routes (`/movies`)

| Method | Endpoint | Auth | Description |
|--------|-----------|------|-------------|
| GET | `/all-movies` | Public | Get all movies (paginated) |
| GET | `/specific-movie/:id` | Public | Get movie details |
| GET | `/new-movies` | Public | Get newest movies |
| GET | `/top-movies` | Public | Get top-rated movies |
| GET | `/random-movies` | Public | Get random movies |
| POST | `/:id/reviews` | Private | Add movie review |
| POST | `/create-movie` | Admin | Create new movie |
| PUT | `/update-movie/:id` | Admin | Update movie |
| DELETE | `/delete-movie/:id` | Admin | Delete movie |
| DELETE | `/delete-comment` | Admin | Delete review comment |

### Upload Routes (`/upload`)

| Method | Endpoint | Auth | Description |
|--------|-----------|------|-------------|
| POST | `/image` | Admin | Upload movie poster |
| DELETE | `/image` | Admin | Delete uploaded image |

---

## Database Schema

### User Model

```javascript
{
  username: String,        // Required
  email: String,          // Required, Unique
  password: String,      // Required (hashed)
  isAdmin: Boolean,      // Default: false
  createdAt: Date,        // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### Genre Model

```javascript
{
  name: String,           // Required, Unique, Max 32 chars
  tmdbId: Number,        // Optional, TMDB genre ID
  createdAt: Date,        // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### Movie Model

```javascript
{
  name: String,           // Required
  image: String,         // Poster image URL
  backdrop: String,      // Backdrop image URL
  year: Number,          // Required
  genres: [ObjectId],  // References Genre
  detail: String,       // Required (description)
  cast: [String],      // Array of cast names
  reviews: [{
    name: String,       // Reviewer name
    rating: Number,   // 1-5 rating
    comment: String,  // Review text
    user: ObjectId    // References User
  }],
  numReviews: Number,   // Default: 0
  rating: Number,       // Average rating (0-5)
  tmdbId: Number,       // TMDB movie ID
  tmdbRating: Number,   // TMDB rating
  popularity: Number,  // TMDB popularity score
  createdAt: Date,
  updatedAt: Date
}
```

---

## Project Architecture

### Backend Structure

```
backend/
├── config/
│   └── db.js           # MongoDB connection
├── controllers/
│   ├── movieController.js
│   ├── userController.js
│   └── genreController.js
├── middlewares/
│   ├── asyncHandler.js
│   ├── authMiddleware.js
│   └── checkId.js
├── models/
│   ├── Movie.js
│   ├── User.js
│   └── Genre.js
├── routes/
│   ├── moviesRoutes.js
│   ├── userRoutes.js
│   ├── genreRoutes.js
│   └── uploadRoutes.js
├── utils/
│   ├── createToken.js
│   └── tmdb.js
├── index.js            # Entry point
└── seed.js           # Database seeder
```

### Frontend Structure

```
frontend/src/
├── pages/
│   ├── Admin/
│   │   ├── AdminMoviesList.jsx
│   │   ├── CreateMovie.jsx
│   │   ├── GenreList.jsx
│   │   ├── UpdateMovie.jsx
│   │   └── Dashboard/
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Navigation.jsx
│   │   └── PrivateRoute.jsx
│   ├── Movies/
│   │   ├── AllMovies.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── MovieTabs.jsx
│   │   └── MoviesContainerPage.jsx
│   └── Home.jsx
├── redux/
│   ├── api/
│   │   ├── apiSlice.js    # RTK Query base
│   │   ├── movies.js
│   │   ├── users.js
│   │   └── genre.js
│   └── features/
│       └── auth/
│           └── authSlice.js
├── component/
│   ├── Loader.jsx
│   ├── Modal.jsx
│   └── SliderUtil.jsx
└── App.jsx
```

---

## Component Hierarchy

```
App (Root)
├── Navigation (Header)
│   ├── Logo
│   ├── Search Bar
│   ├── Nav Links (Home, Movies, Admin)
│   └── Auth Buttons (Login/Register or Profile/Logout)
│
├── Outlet (Route Content)
│   ├── Home
│   │   └── Featured Sections
│   │
│   ├── AllMovies
│   │   ├── Banner
│   │   ├── Search/Filter Bar
│   │   └── Movie Grid
│   │       └── MovieCard (repeated)
│   │
│   ├── MovieDetails
│   │   ├── Hero Banner
│   │   ├── MovieTabs
│   │   │   ├── Reviews
│   │   │   ├── Cast
│   │   │   └── Related
│   │   └── Review Form
│   │
│   ├── Login / Register
│   │   ├── Form
│   │   └── Side Image
│   │
│   └── Admin (Protected)
│       ├── Dashboard
│       ├── CreateMovie
│       ├── UpdateMovie
│       └── Manage Content
```

---

## Authentication Flow

1. **Register**: POST to `/api/v1/users` → Create JWT → Store in HTTP-only cookie
2. **Login**: POST to `/api/v1/users/auth` → Validate credentials → Create JWT → Store in cookie
3. **Protected Routes**: Middleware checks JWT signature and validity

### JWT Payload Structure
```javascript
{
  userId: ObjectId,
  isAdmin: Boolean,
  exp: UnixTimestamp
}
```

---

## Assumptions & Design Decisions

### Authentication
- JWT stored in HTTP-only cookies for security
- 30-day token expiration
- Cookie parsing for session management

### Movie Data
- Uses TMDB API for initial data seeding
- Supports both local uploads and TMDB images
- Reviews require authentication

### Frontend State
- RTK Query for server state caching
- Redux for client state (filters, auth)
- Optimistic updates for better UX

### Admin Features
- Separate protected admin routes
- Admin middleware on sensitive operations
- Movie/Genre CRUD operations

---

## UI/UX Wireframes (Text-based)

### Home Page
```
┌─────────────────────────────────────────────┐
│  NAVBAR: Logo │ Search │ Home Movies Admin │
├─────────────────────────────────────────────┤
│  HERO: Large banner with featured movie     │
│        Title + CTA Button                │
├─────────────────────────────────────────────┤
│  SECTIONS:                               │
│  [Trending Movies] ───► horizontal scroll │
│  [New Releases] ───► horizontal scroll   │
│  [Top Rated] ───► horizontal scroll     │
├─────────────────────────────────────────────┤
│  FOOTER: Copyright │ Links │ Social       │
└─────────────────────────────────────────────┘
```

### All Movies Page
```
┌─────────────────────────────────────────────┐
│  BANNER: Background Image + Title          │
├─────────────────────────────────────────────┤
│  FILTERS: [Search] [Genre▼] [Year▼] [Sort]│
├─────────────────────────────────────────────┤
│  GRID: ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│       │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │  │
│       └────┘ └────┘ └────┘ └────┘  │
│       ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│       │ 🎬 │ │ 🎬 │ │ 🎬 │ │ 🎬 │  │
│       └────┘ └────┘ └────┘ └────┘  │
├─────────────────────────────────────────────┤
│  PAGINATION: « 1 2 3 4 5 ... »         │
└─────────────────────────────────────────────┘
```

### Login/Register Page
```
┌───────────────────────┬───────────────────┐
│                       │                   │
│   REGISTER FORM      │   IMAGE           │
│   ─────────────     │   (right side)    │
│   Name: [_______]   │                   │
│   Email: [_______]  │                   │
│   Pass: [_______]  │                   │
│   Confirm: [__]   │                   │
│   [REGISTER]       │                   │
│                       │                   │
│   Already have     │                   │
│   account? Login   │                   │
└───────────────────────┴───────────────────┘
```

---

## Environment Variables

### Backend (.env)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/moviehub
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Frontend
```
VITE_API_URL=http://localhost:3000/api/v1
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

```bash
# Clone the repository
cd MERN-Movies-App

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start MongoDB
mongod

# Start backend (in one terminal)
cd backend
npm start

# Start frontend (in another terminal)
cd frontend
npm run dev
```

### Seeding Data

```bash
cd backend
npm run seed
```

This will populate the database with sample movies from TMDB.
