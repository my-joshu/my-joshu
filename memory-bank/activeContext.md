# Active Context

## Current Work Focus

The MyJoshu project is currently in its initial setup phase. The core architecture and foundational components have been established, and the focus is on building out the essential features for a functional MVP (Minimum Viable Product).

### Primary Focus Areas

1. **Core Q&A Functionality**

   - Real-time question submission and display
   - Question management for speakers
   - Anonymous access for attendees

2. **AI Integration**

   - Answer hint generation using Google Gemini API
   - Context-aware responses based on presentation content
   - Efficient prompt engineering for relevant hints

3. **User Experience**
   - Intuitive interfaces for both speakers and attendees
   - Responsive design for all device types
   - Seamless real-time updates

## Recent Changes

As this is the initial setup of the memory bank, there are no specific recent changes to document. The project structure has been established with the following key components:

1. **Frontend Components**

   - PresentationDashboard for managing presentations
   - QASession for attendee question submission
   - SpeakerQASession for speaker question management
   - AnswerHint for displaying AI-generated hints

2. **Backend Services**

   - Supabase integration for database and authentication
   - API routes for answer hint generation
   - Real-time channels for live updates

3. **Database Schema**
   - Tables for speakers, attendees, presentations, questions, and answer hints
   - Relationships between entities
   - Indexes for efficient queries

## Next Steps

The following steps are planned for the immediate future:

1. **Feature Completion**

   - Implement upvoting functionality for questions
   - Enhance answer hint generation with more context
   - Add presentation analytics

2. **User Experience Improvements**

   - Refine the mobile experience
   - Add loading states and error handling
   - Improve accessibility

3. **Testing and Validation**

   - Implement comprehensive testing
   - Gather user feedback
   - Iterate based on user testing

4. **Security**

- Set RLS policies for data protection
  - Already created related Pull-Request, but it is WIP status, because test not passed yet.
    - PR: https://github.com/my-joshu/my-joshu/pull/28

5. **Documentation**
   - Complete API documentation
   - Add user guides for speakers and attendees
   - Document deployment procedures

## Active Decisions and Considerations

Several key decisions and considerations are currently being evaluated:

1. **AI Model Selection**

   - Currently using Google Gemini API
   - Evaluating performance and cost
   - Considering alternatives or fallbacks

2. **Real-time Performance**

   - Monitoring Supabase real-time performance
   - Considering optimizations for high-volume scenarios
   - Evaluating scaling strategies

3. **Authentication Flow**

   - Current implementation uses Supabase Auth
   - Considering additional authentication providers
     - Social Login: Google, GitHub
     - Passwordless Login: Magic.link, etc.
     - Using Passkey
   - Evaluating security best practices

4. **Data Privacy**

   - Ensuring compliance with data protection regulations
   - Implementing appropriate data retention policies
   - Securing sensitive information

5. **Deployment Strategy**
   - Planning for production deployment
     - Currently using Vercel for hosting of Next.js application with React Server Components and server actions
     - How to run Next.js app on Google Cloud Run or AWS Lambda to avoid vendor lock-in
   - Considering CI/CD pipeline setup
   - Evaluating hosting options
