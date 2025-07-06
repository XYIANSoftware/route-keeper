# RouteKeeper

A mobile-first web application for truck drivers to track drives, stops, and routes with GPS coordinates and comprehensive analytics.

## 🚛 Features

- **GPS Drive Tracking**: Start and stop drives with automatic GPS tracking
- **Stop Management**: Record gas stops, food breaks, rest periods, and maintenance
- **Mobile-First Design**: Optimized for mobile use with touch-friendly interface
- **Real-time Analytics**: View detailed insights about your driving patterns
- **Secure & Fast**: Built with modern tech stack for security and performance
- **Responsive Design**: Works seamlessly across all devices

## 🎨 Design System

- **Theme**: Glossy dark brown/tan with cyan accents
- **Mobile-First**: Responsive design optimized for mobile devices
- **PrimeReact Components**: Modern UI components for consistent experience
- **Tailwind CSS**: Utility-first styling for rapid development

## 🛠 Tech Stack

- **Frontend**: Next.js 15.3.5+, React 18, TypeScript
- **UI Framework**: PrimeReact with PrimeIcons and PrimeFlex
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (Auth, Database, Storage)
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/route-keeper.git
cd route-keeper
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.template .env.local
```

4. Configure your Supabase credentials in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile Optimization

- Touch-friendly interface with large buttons and gestures
- Responsive design that adapts to all screen sizes
- Optimized performance for mobile networks
- PWA capabilities for app-like experience

## 🎯 Key Components

### Header Component

- Mobile hamburger menu with sidebar navigation
- Desktop navigation with user profile
- Fixed 75x75 logo with responsive sizing
- Glossy dark brown/tan theme with cyan accents

### Home Page Sections

- **Hero Section**: Eye-catching introduction with CTA buttons
- **Features Section**: Highlighted features with interactive cards
- **Stats Section**: Social proof with testimonials
- **CTA Section**: Final call-to-action with trial information

### Authentication

- Secure signup/login with Supabase Auth
- Form validation with React Hook Form and Zod
- Error handling and user feedback
- Profile creation with automatic triggers

## 📊 Database Schema

The application uses Supabase with the following main tables:

- `profiles`: User profile information
- `drives`: Drive tracking data with GPS coordinates
- `stops`: Stop information and categorization
- `analytics`: Aggregated analytics data

## 🔧 Development

### Code Style

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Mobile-first responsive design
- Component-driven architecture

### File Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable React components
│   ├── common/         # Common UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── sections/       # Page section components
├── hooks/              # Custom React hooks
├── providers/          # Context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🚀 Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 📄 Legal

- [Terms of Service](/terms)
- [Privacy Policy](/privacy)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and build
5. Submit a pull request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## 📞 Support

For support, email support@routekeeper.com or create an issue in the repository.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
