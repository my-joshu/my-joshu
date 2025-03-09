# Technical Context

## Technologies Used

### Frontend Technologies

1. **Next.js 14**

   - React framework for building the user interface
   - App Router for file-based routing
   - Server Components for improved performance
   - Server Actions for form handling

2. **React 18**

   - Component-based UI library
   - Hooks for state management and side effects
   - Server and Client Components

3. **Tailwind CSS**

   - Utility-first CSS framework
   - Custom component styling
   - Responsive design system

4. **UI Component Libraries**
   - Radix UI for accessible primitives
   - Custom UI components built on top of Radix

### Backend Technologies

1. **Supabase**

   - PostgreSQL database
   - Authentication and authorization
   - Real-time subscriptions
   - Row-level security

2. **Next.js API Routes**

   - Serverless functions for backend logic
   - API endpoints for client-server communication

3. **Google Gemini API**
   - AI model for generating answer hints
   - Natural language processing capabilities

### Development Tools

1. **TypeScript**

   - Static typing for JavaScript
   - Type safety and improved developer experience

2. **pnpm**

   - Fast, disk-space efficient package manager
   - Dependency management

3. **Vitest**
   - Testing framework for unit tests
   - Fast, modern testing experience

## Development Setup

### Local Environment Setup

1. **Prerequisites**

   - Node.js (LTS version)
   - pnpm package manager
   - Supabase CLI
   - Git

2. **Installation Steps**

   - Clone the repository
   - Install dependencies with `pnpm i`
   - Set up environment variables
   - Start Supabase with `pnpm run supabase:start`
   - Run migrations with `pnpm run supabase:dbreset`
   - Start the development server with `pnpm run dev`

3. **Environment Variables**
   - Supabase URL and API keys
   - Gemini API key
   - Other configuration variables

### Development Workflow

1. **Local Development**

   - Run the Next.js development server
   - Connect to local Supabase instance
   - Make changes with hot reloading

2. **Testing**

   - Run unit tests with Vitest
   - Manual testing of features

3. **Database Migrations**
   - Create migrations for schema changes
   - Apply migrations to local and production databases

## Technical Constraints

### Performance Considerations

1. **Real-time Updates**

   - Efficient handling of real-time subscriptions
   - Optimizing for low latency in Q&A sessions

2. **AI Processing**

   - Managing response times for AI-generated hints
   - Balancing quality and speed of generated content

3. **Mobile Responsiveness**
   - Ensuring good performance on mobile devices
   - Optimizing for various screen sizes

### Security Constraints

1. **Authentication**

   - Secure user authentication
   - Protection of speaker accounts
   - Anonymous access for attendees

2. **Data Protection**

   - Secure storage of presentation data
   - Privacy considerations for Q&A content

3. **API Security**
   - Protection of API endpoints
   - Rate limiting and abuse prevention

### Scalability Considerations

1. **Database Scaling**

   - Handling increased load on the database
   - Efficient query patterns

2. **API Scaling**

   - Managing increased API requests
   - Optimizing serverless function performance

3. **AI Service Scaling**
   - Managing API rate limits
   - Optimizing AI request patterns

## Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.15.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-icons": "^1.3.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "@supabase/ssr": "^0.3.0",
    "@supabase/supabase-js": "^2.43.5",
    "@uiw/react-markdown-preview": "^5.1.2",
    "@vercel/analytics": "^1.3.1",
    "autoprefixer": "10.4.19",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "date-fns-tz": "^3.1.3",
    "filepond": "^4.31.1",
    "filepond-plugin-file-validate-size": "^2.2.8",
    "filepond-plugin-file-validate-type": "^1.2.9",
    "filesize": "^10.1.4",
    "geist": "^1.3.0",
    "lucide-react": "^0.396.0",
    "next": "^14.2.4",
    "officeparser": "^4.1.1",
    "postcss": "8.4.33",
    "qrcode": "^1.5.3",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-filepond": "^7.1.2",
    "tailwind-merge": "^2.3.0",
    "tailwindcss": "3.4.4",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "5.4.5",
    "zod": "^3.23.8"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "@types/node": "20.14.6",
    "@types/qrcode": "^1.5.5",
    "@types/react": "18.3.3",
    "@types/react-dom": "18.3.0",
    "encoding": "^0.1.13",
    "supabase": "^1.178.2",
    "vercel": "^34.2.7",
    "vitest": "^1.6.0"
  }
}
```

### Key Dependency Purposes

1. **UI and Styling**

   - Radix UI: Accessible UI primitives
   - Tailwind CSS: Utility-first styling
   - Lucide React: Icon library

2. **Data Management**

   - Supabase: Database and authentication
   - Zod: Schema validation

3. **File Handling**

   - FilePond: File upload handling
   - OfficeParser: Parsing presentation files

4. **Date Handling**

   - date-fns: Date manipulation
   - date-fns-tz: Timezone support

5. **AI Integration**

   - Google Generative AI: Gemini API client

6. **QR Code Generation**
   - qrcode: QR code generation for presentation sharing
