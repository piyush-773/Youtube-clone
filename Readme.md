# PK Hub - Video Sharing Platform

PK Hub is a YouTube-like video-sharing platform that allows users to upload, watch, like, save, and manage videos with a user-friendly interface.

## 🚀 Features

### 🎥 Video Management
- **Upload Videos** - Users can upload videos with a title, description, and thumbnail.
- **Watch Videos** - Stream videos in a YouTube-style player.
- **Edit Videos** - Update video details such as title, description, and thumbnail.
- **Delete Videos** - Remove videos permanently.

### ❤️ User Interaction
- **Like Videos** - Users can like/unlike videos.
- **Comment on Videos** - Leave comments and engage with other users.
- **Save to Watch Later** - Bookmark videos for later viewing.
- **View Video History** - Keep track of previously watched videos.

### 🔐 User Authentication & Security
- **JWT Authentication** - Secure login & signup using JSON Web Tokens.
- **User CRUD Operations** - Edit profile details, change passwords, and delete accounts.
- **Role-based Access** - Admin and User roles for better platform management.

### 🔍 Search & Explore
- **Search Videos** - Find videos easily using the search bar.
- **Filter & Sort Videos** - Sort by trending, newest, and most liked.
- **Category-based Browsing** - Discover videos by category.

### 📂 Playlists & Library
- **Create & Manage Playlists** - Organize videos into custom playlists.
- **Liked Videos** - A section to view all liked videos.
- **Subscriptions** - Follow favorite creators and get notified about new uploads.

### 📡 Real-time Features
- **Live Streaming Support (Upcoming feature)** - Users can broadcast live videos.
- **Real-time Notifications** - Get alerts for new likes, comments, and uploads.

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **Tailwind CSS** - Styling
- **Axios** - API Requests
- **React Router** - Navigation

### Backend
- **Node.js & Express.js** - Server-side handling
- **MongoDB & Mongoose** - Database management
- **JWT Authentication** - Secure user authentication
- **Cloudinary** - Video storage & streaming

### Deployment
- **Frontend** - Vercel / Netlify
- **Backend** - Render / Heroku
- **Database** - MongoDB Atlas

## ⚡ Getting Started

### 1️⃣ Clone Repository
```sh
git clone https://github.com/piyush-773/Pk-Hub.gitcd server
```

### 2️⃣ Install Dependencies
```sh
cd Pk-Hub
cd client
npm install  # For Frontend
cd ..
cd server
npm install  # For Backend
```

### 3️⃣ Start Development Server
```sh
npm run dev  # Backend
npm start  # Frontend
```

### 4️⃣ Environment Variables
Create a `.env` file in the root directory and add:
## Backend
```.env
PORT=
CORS_ORIGIN=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
MONGODB_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Frontend
```.env
REACT_APP_BASE_URL=
```
### 🙌 Contributing
Feel free to fork and contribute to the project by submitting a pull request.

### 📝 License
This project is licensed under the MIT License.

### 📧 Contact
For queries, reach out at: piyushlikeyou@gmail.com

Made with ❤️ by Piyush Kumar 🚀
