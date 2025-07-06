# RouteKeeper

A mobile-first web application for truck drivers to track their drives, stops, and routes with GPS coordinates and comprehensive analytics.

## 🚚 Features

- **User Authentication**: Secure email/password authentication
- **Drive Tracking**: Start/stop drives with GPS coordinates and automatic timing
- **Stop Management**: Record stops by category (gas, food, rest, maintenance, other)
- **Drive History**: View past drives with detailed analytics and stop information
- **Mobile-First Design**: Responsive interface optimized for mobile devices
- **Real-time Updates**: Live drive timers and instant data synchronization
- **Dark Theme**: Beautiful dark theme with modern UI components

## 🛠 Tech Stack

- **Frontend**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PrimeReact
- **Backend**: Supabase (Auth, Database, Real-time)
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home marketing page
│   ├── login/
│   │   └── page.tsx        # Authentication page
│   └── [username]/
│       ├── dashboard/
│       │   └── page.tsx    # User dashboard
│       └── drives/
│           └── [driveid]/
│               └── page.tsx # Drive details page
├── components/             # Reusable UI components
│   ├── common/             # Common components
│   ├── forms/              # Form components
│   ├── inputs/             # Form input components
│   ├── layout/             # Layout components
│   ├── DriveCard.tsx       # Current drive display with timer
│   └── DriveList.tsx       # DataTable for drive history
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── providers/              # Context providers
└── types/                  # TypeScript type definitions
```

## 🚀 Quick Start

### For Users

1. Visit the live application at [routekeeper.app](https://routekeeper.app)
2. Create an account or sign in
3. Start tracking your drives and stops

### For Developers

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/route-keeper.git
   cd route-keeper
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   ```bash
   cp env.template .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Set up your Supabase database

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to the SQL Editor in your dashboard
   - Run the contents of `supasetup.sql` to create the required tables and functions

5. Start the development server

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Design

The app features a modern, mobile-first design with:

- Responsive layout that works on all devices
- Dark theme for better visibility in low-light conditions
- Intuitive navigation and user interface
- Real-time updates and smooth animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@routekeeper.app or create an issue in this repository.

## 📈 Roadmap

- [ ] Map integration with route visualization
- [ ] Driver analytics and reporting
- [ ] Fleet management features
- [ ] Mobile app (React Native)
- [ ] Integration with ELD devices
- [ ] Real-time notifications
- [ ] Export functionality (PDF, CSV)
- [ ] Multi-language support
