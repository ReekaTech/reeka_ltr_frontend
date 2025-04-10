# Reeka Long Term Rentals Frontend

A modern property management system built with Next.js 15, TypeScript, and
Tailwind CSS.

## 🚀 Features

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Authentication system
- Responsive design
- Form validation
- Husky for git hooks
- ESLint and Prettier for code quality
- Playwright for end-to-end testing

## 📦 Prerequisites

- Node.js 22.12.0 or later
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd reeka_ltr_frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add the following:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

## 🚀 Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

Run end-to-end tests:

```bash
npm run test:e2e
# or
yarn test:e2e
```

## 📦 Build

Build the application for production:

```bash
npm run build
# or
yarn build
```

## 🚀 Production

Start the production server:

```bash
npm run start
# or
yarn start
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Form Handling:** React Hook Form
- **Testing:** Playwright
- **Code Quality:** ESLint, Prettier
- **Git Hooks:** Husky
- **Package Manager:** npm/yarn

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## 🔒 Authentication

The application uses NextAuth.js for authentication. Current authentication
features include:

- Email/password sign in
- Email verification
- Password reset
- Protected routes

## 🎨 Styling

The application uses Tailwind CSS for styling with:

- Custom color palette
- Dark mode support
- Responsive design
- Custom animations

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## 📝 License

MIT License
