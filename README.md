# 📚 The Index: LIS Journal

A modern, elegant digital journal exploring the intersection of library science, technology, and culture. Built as a project for LIS403.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18+-green.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)

## ✨ Features

### 🎨 Beautiful Design
- Elegant, newspaper-inspired layout
- Smooth animations and transitions
- Responsive design for all devices
- Dark mode support

### 📝 Content Management
- **Admin Dashboard** with professional confirmation modals
- Rich text editor with HTML support
- Draft and publish workflow
- Post management (create, edit, delete)
- Image upload support

### 🤖 AI-Powered Features
- **AI Librarian** - Ask questions about library science
- **Text-to-Speech** - Listen to articles with synchronized highlighting
- Powered by Google Gemini AI

### 💬 Engagement
- Comments system
- Reactions (hearts, insightful, bookmarks)
- Real-time interaction

### 🌍 Multilingual Support
- English, Igbo, Yoruba, Hausa
- Localized UI translations

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **TypeScript** - Type safety

### AI & Services
- **Google Gemini AI** - AI features
- **CORS** - Cross-origin support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devsimoogle/lis-journal.git
   cd lis-journal
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install

   # Backend
   cd server
   npm install
   cd ..
   ```

3. **Set up environment variables**

   **Frontend** (`.env`):
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

   **Backend** (`server/.env`):
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/lis_journal
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb lis_journal

   # Seed with initial content
   cd server
   npm run seed
   cd ..
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## 📖 Usage

### Admin Access
- Navigate to `/admin`
- Default passwords: `admin` or `lis403`

### Creating Posts
1. Login to admin panel
2. Fill in post details
3. Choose "Published" or "Draft"
4. Confirm publication

### AI Features
- Click the librarian icon to ask questions
- Click the audio icon on any post to listen

## 🌐 Deployment

This application can be deployed using:
- **Frontend**: Vercel (recommended)
- **Backend**: Railway, Render, or Heroku
- **Database**: Railway PostgreSQL, Render PostgreSQL, or Heroku Postgres

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed instructions.

### Quick Deploy (Recommended)

**Frontend (Vercel)**:
```bash
npm i -g vercel
vercel
```

**Backend (Railway)**:
```bash
npm i -g @railway/cli
railway login
cd server
railway up
```

See **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** for step-by-step deployment.

## 📁 Project Structure

```
lis-journal/
├── components/          # React components
│   ├── AdminPanel.tsx   # Admin dashboard
│   ├── BlogPost.tsx     # Post display
│   └── ...
├── services/           # API services
│   ├── storage.ts      # Data management
│   └── geminiService.ts # AI features
├── server/             # Backend
│   ├── src/
│   │   ├── index.ts    # Express server
│   │   ├── db.ts       # Database config
│   │   ├── services.ts # Business logic
│   │   └── seed.ts     # Database seeding
│   └── package.json
├── types/              # TypeScript types
├── .env                # Frontend environment
└── package.json        # Frontend dependencies
```

## 🎯 Key Features Explained

### Admin Dashboard Improvements
- **Delete Confirmation**: Prevents accidental deletions with warning modal
- **Publish Confirmation**: Shows post details before publishing
- **Status Management**: Clear visual indicators for published/draft posts

### AI Integration
- **Librarian Chat**: Context-aware responses about library science
- **Text-to-Speech**: Natural voice synthesis with word highlighting
- **Source Citations**: AI responses include credible sources

## 🔒 Security

- API keys stored in environment variables
- Admin session management
- CORS protection
- Input validation
- SQL injection prevention (parameterized queries)

## 🤝 Contributing

This is a student project, but suggestions are welcome!

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Olajuwon O.**

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Step-by-step deployment
- [Quick Fix Guide](./QUICK_FIX_GUIDE.md) - Troubleshooting
- [Seeding Guide](./server/SEEDING_GUIDE.md) - Database seeding

## 🐛 Known Issues

- None currently! 🎉

## 🔮 Future Enhancements

- [ ] User authentication system
- [ ] Post editing functionality
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Social media sharing
- [ ] RSS feed

## 📞 Support

For issues and questions:
1. Check the documentation files
2. Review the troubleshooting section
3. Open an issue on GitHub

---

**Made with ❤️ By Olajuwon**

*Exploring the future of library science.*
