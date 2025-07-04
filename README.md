# RouteKeeper

A mobile-first web application for truck drivers to track their drives, stops, and routes with GPS coordinates and comprehensive analytics.

## 🚚 Features

- **User Authentication**: Secure email/password authentication with Supabase
- **Drive Tracking**: Start/stop drives with GPS coordinates and automatic timing
- **Stop Management**: Record stops by category (gas, food, rest, maintenance, other)
- **Drive History**: View past drives with detailed analytics and stop information
- **Mobile-First Design**: Responsive interface optimized for mobile devices
- **Real-time Updates**: Live drive timers and instant data synchronization
- **Dark Theme**: Beautiful Lara Dark Teal theme with PrimeReact components

## 🛠 Tech Stack

- **Frontend**: Next.js 15.3.5+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PrimeReact + PrimeFlex
- **UI Components**: PrimeReact (Lara Dark Teal theme)
- **Icons**: PrimeIcons
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (Auth, Database, Real-time)
- **State Management**: React Context API
- **Build Tool**: Next.js with TypeScript

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
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   ├── forms/              # Form components
│   │   ├── AuthForm.tsx    # Login/signup form
│   │   └── StopForm.tsx    # Stop creation form
│   ├── inputs/             # Form input components
│   │   ├── FormInput.tsx
│   │   ├── FormPassword.tsx
│   │   ├── FormDropdown.tsx
│   │   └── FormTextarea.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx      # Navigation header
│   │   └── SidebarMenu.tsx # Mobile sidebar navigation
│   ├── DriveCard.tsx       # Current drive display with timer
│   └── DriveList.tsx       # DataTable for drive history
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication hook
│   └── useDrive.ts         # Drive management hook
├── lib/                    # Utility libraries
│   └── supabase.ts         # Supabase client configuration
├── providers/              # Context providers
│   ├── app-context.tsx     # Main app context
│   └── primereact-provider.tsx # PrimeReact theme provider
└── types/                  # TypeScript type definitions
    └── index.ts            # All app interfaces
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend services)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/XYIANSoftware/route-keeper.git
   cd route-keeper
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://fuiyuaxpghfajxmzichk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aXl1YXhwZ2hmYWp4bXppY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTM2ODIsImV4cCI6MjA2NzIyOTY4Mn0.4PMRGQjA1ldffILrQza86DiomvgDiQn6kcyxKhojaXk
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Supabase Setup

### 1. Database Schema

Run the following SQL in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create drives table
CREATE TABLE drives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  start_latitude DECIMAL(10, 8),
  start_longitude DECIMAL(11, 8),
  end_latitude DECIMAL(10, 8),
  end_longitude DECIMAL(11, 8),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stops table
CREATE TABLE stops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  drive_id UUID REFERENCES drives(id) ON DELETE CASCADE NOT NULL,
  category TEXT CHECK (category IN ('gas', 'food', 'rest', 'maintenance', 'other')) NOT NULL,
  notes TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_drives_user_id ON drives(user_id);
CREATE INDEX idx_drives_start_time ON drives(start_time);
CREATE INDEX idx_stops_drive_id ON stops(drive_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own drives" ON drives
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drives" ON drives
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drives" ON drives
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view stops for own drives" ON stops
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert stops for own drives" ON stops
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM drives
      WHERE drives.id = stops.drive_id
      AND drives.user_id = auth.uid()
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'username', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

### 2. Authentication Setup

- In Supabase Dashboard, go to Authentication > Settings
- Configure your site URL and redirect URLs
- Set up email templates if needed

## 📱 Pages & Routes

- `/` - Home marketing page with hero section and features
- `/login` - Authentication page (login/signup)
- `/[username]/dashboard` - User dashboard with current drive and history
- `/[username]/drives/[driveid]` - Detailed view of a specific drive

## 🎨 Styling

The app uses a combination of:

- **Tailwind CSS** for utility-first styling
- **PrimeReact** components with Lara Dark Teal theme
- **PrimeFlex** for responsive layouts
- **PrimeIcons** for consistent iconography

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Style

- Follow the existing Prettier configuration
- Use TypeScript for all components
- Follow React best practices
- Mobile-first responsive design
- Use PrimeReact components consistently

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

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
