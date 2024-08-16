# MyJoshu

Welcome to MyJoshu, an open-source AI-powered tool designed to enhance your presentation Q&A sessions with confidence.

https://github.com/user-attachments/assets/e7fcedd5-fc87-4888-996a-e4ad7c4d33db

## Features

- **Tailored Answer Hints**: Get AI-driven suggestions for unexpected or anticipated questions.
- **Audience Live Q&A**: Engage your audience in real-time.
- **Efficient Management**: Real-time updates and seamless question handling.

## Built with

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gemini API](https://ai.google.dev/)

## Setup

### Prerequisites

Set up accounts and obtain API keys for:

- Supabase
- Vercel (For production use)
- Gemini API

### Local Setup

Follow these steps to set up MyJoshu on your local machine:

- Clone the Repository

  ```shell
  git clone git@github.com:my-joshu/my-joshu.git
  ```

- Navigate to the Project Directory

  ```shell
  cd my-joshu
  ```

- Install Dependencies

  ```shell
  pnpm i
  ```

- Setup Supabase

  ```shell
  pnpm supabase start
  ```

  ```shell
  pnpm supabase migration up
  ```

- Configure Environment Variables

  - Copy `.env.example` to `.env.local`.
  - Fill in your API keys and URLs.

- Run the Next.js Server

  ```shell
  pnpm run dev
  ```
