# Babylon Assessment - Next.js Firebase Authentication App

A simple Next.js application with Firebase Authentication featuring user registration and login functionality.

## Features

- **Login/Registration Page** with Full Name, Email, and Password fields
- **Input Validation** for all form fields
- **Firebase Authentication** for user management
- **Home Page** with personalized greeting and logout functionality
- **Protected Routes** that redirect unauthenticated users

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable **Email/Password** provider
4. Enable **Firestore Database**:
   - Go to Firestore Database
   - Create database in test mode (for development)
5. Get your Firebase configuration:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web icon (`</>`) to add a web app
   - Copy the Firebase configuration values

### 3. Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```

2. Fill in your Firebase configuration in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Registration Flow
- When a new user submits the form, the app attempts to log in first
- If login fails (user not found), it automatically registers the user
- User's full name is stored in both Firebase Auth (displayName) and Firestore

### Login Flow
- Existing users can log in with their email and password
- Upon successful authentication, users are redirected to the home page

### Home Page
- Displays a personalized greeting with the user's full name
- Includes a logout button that signs out the user and redirects to the login page

## Project Structure

```
├── app/
│   ├── page.tsx          # Login/Registration page
│   ├── home/
│   │   └── page.tsx      # Home page (protected)
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── lib/
│   ├── firebase.ts       # Firebase initialization
│   └── auth.ts           # Authentication functions
├── .env.local            # Environment variables (create this)
└── package.json          # Dependencies
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Firebase Authentication** - User authentication
- **Firestore** - User data storage

## Notes

- The app automatically handles both registration and login through a single form
- User data (full name) is stored in Firestore for easy retrieval
- Routes are protected - unauthenticated users are redirected to the login page
- The app uses Firebase's `onAuthStateChanged` to monitor authentication state

