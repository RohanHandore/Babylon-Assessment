# Babylon Assessment - Next.js Firebase Authentication App

A simple Next.js application with Firebase Authentication featuring user registration and login functionality.

## Features

- **Separate Login and Sign Up** tabs for better user experience
- **Email/Password Authentication** with form validation
- **Google Sign-In** for quick authentication
- **Input Validation** for all form fields with helpful error messages
- **Firebase Authentication** for secure user management
- **Firestore Integration** for storing user data
- **Home Page** with personalized greeting and logout functionality
- **Protected Routes** that redirect unauthenticated users
- **Responsive Design** with Tailwind CSS

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
   - Enable **Google** provider (optional, for Google Sign-In)
     - Click on Google
     - Toggle "Enable" to ON
     - Set a project support email
     - Click "Save"
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

### Registration Flow (Sign Up)
- Users click the "Sign Up" tab and fill in their Full Name, Email, and Password
- The app validates all fields before submission
- New user account is created in Firebase Authentication
- User's full name is stored in both Firebase Auth (displayName) and Firestore
- Upon successful registration, users are redirected to the home page

### Login Flow
- Users click the "Login" tab and enter their Email and Password
- The app validates the credentials with Firebase
- Upon successful authentication, users are redirected to the home page
- If credentials are invalid, appropriate error messages are displayed

### Google Sign-In
- Users can click "Sign in with Google" button
- A popup opens for Google authentication
- User data is automatically saved to Firestore on first sign-in
- Upon successful authentication, users are redirected to the home page

### Home Page
- Displays a personalized greeting with the user's full name
- Includes a logout button that signs out the user and redirects to the login page
- Protected route - unauthenticated users are automatically redirected to login

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

- Separate Login and Sign Up flows for clarity and better UX
- User data (full name) is stored in Firestore for easy retrieval
- Routes are protected - unauthenticated users are redirected to the login page
- The app uses Firebase's `onAuthStateChanged` to monitor authentication state
- Firebase initializes only on the client side to avoid SSR issues

## Project Summary

This project is a login app built with Next.js and Firebase. The app has a login page with tabs for "Login" and "Sign Up", and users can sign in with email/password or Google. After signing in, they see a personalized home page with their name and a logout button.

The main challenge was getting Firebase to work with Next.js. Firebase needs to run only in the browser, not on the server, so I added checks to initialize it only on the client side. Another issue was the `.env.local` file being in the wrong folder, which prevented Firebase from loading. I moved it to the project root and added validation to catch this early.

For the future, I'd add password reset, email verification, a profile page, and more social login options. I'd also add tests, improve error messages, and add a loading spinner. The app is deployed to Firebase Hosting, so it's live and accessible online. Overall, it's a working authentication system that can be extended with more features as needed.

