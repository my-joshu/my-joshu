import Link from "next/link";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";

export default async function Index() {
  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white">
      <nav className="w-full flex justify-center border-b border-gray-700 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <Link href="/">
            <p className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
              MyJoshu
            </p>
          </Link>
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="flex-1 w-full flex flex-col items-center">
        <main className="w-full max-w-4xl flex flex-col items-center p-4 sm:p-6 md:p-8">
          <section className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-center p-8">
            <h1 className="text-6xl sm:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
              MyJoshu
            </h1>
            <h3 className="text-2xl sm:text-4xl font-bold mb-6 text-teal-400">
              AI-Powered Q&A Assistance
            </h3>
            <p className="text-2xl mb-12 opacity-80 text-gray-400">
              Ace your presentation Q&A with confidence
            </p>
            <Link href="/presentations">
              <p className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold py-4 px-10 rounded-lg hover:shadow-xl transition duration-300 hover:from-indigo-700 hover:to-purple-700">
                Get Started
              </p>
            </Link>
          </section>

          <section id="features" className="w-full py-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">
              Key Features
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <li className="bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
                <span className="text-2xl">⚡</span>
                <span className="font-medium">Real-time AI Assistance</span>
              </li>
              <li className="bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
                <span className="text-2xl">⏱️</span>
                <span className="font-medium">Audience Live Q&A</span>
              </li>
              <li className="bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <span className="font-medium">Tailored Answer Hints</span>
              </li>
            </ul>
          </section>

          <section id="how-it-works" className="w-full py-16">
            <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">
              How It Works
            </h2>
            <p className="text-lg mb-4 text-gray-400 text-center">
              Get started in just 4 steps:
            </p>
            <ol className="space-y-8 w-full relative">
              {[
                "Create Account",
                "Upload Presentation",
                "Share QR Code with Attendees",
                "Answer Confidently with AI Hints",
              ].map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-center relative bg-gray-800 p-6 rounded-lg shadow-md"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-teal-400 text-white font-semibold text-lg mr-4">
                    {idx + 1}
                  </div>
                  <div className="text-lg font-medium">{step}</div>
                </li>
              ))}
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
}
