import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";

export default async function Index() {
  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <p className="font-bold text-lg">MyJoshu</p>
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>

      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <main className="w-full max-w-4xl flex flex-col gap-20 items-center p-4 sm:p-6 md:p-8">
          <section className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              MyJoshu
            </h1>
            <h3 className="text-xl sm:text-5xl font-bold mb-4">
              AI-Powered Q&A Support
            </h3>
            <p className="text-xl mb-8 opacity-80">
              Ace your presentation Q&A with confidence
            </p>
            <button className="bg-btn-background text-foreground font-bold py-3 px-8 rounded-full hover:bg-btn-background-hover transition duration-300">
              Try It Now
            </button>
          </section>

          <section id="features" className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Key Features
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="bg-btn-background p-6 rounded-lg">
                Real-time AI assistance
              </li>
              <li className="bg-btn-background p-6 rounded-lg">
                Rapid question analysis
              </li>
              <li className="bg-btn-background p-6 rounded-lg">
                Accurate answer suggestions
              </li>
              <li className="bg-btn-background p-6 rounded-lg">
                Multi-language support
              </li>
            </ul>
          </section>

          <section id="how-it-works" className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              How It Works
            </h2>
            <ol className="list-decimal list-inside space-y-4">
              <li className="text-lg">Upload your presentation</li>
              <li className="text-lg">Start Q&A session</li>
              <li className="text-lg">Receive audience questions</li>
              <li className="text-lg">Get instant AI-powered hints</li>
              <li className="text-lg">Answer with confidence</li>
            </ol>
          </section>

          <section id="pricing" className="w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Pricing Plans
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-btn-background p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Starter Plan</h3>
                <p className="text-4xl font-bold mb-6">$10/month</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Up to 5 sessions per month
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Basic AI support
                  </li>
                </ul>
              </div>
              <div className="bg-btn-background p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Professional Plan</h3>
                <p className="text-4xl font-bold mb-6">$50/month</p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Unlimited sessions
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Advanced AI support
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Priority customer service
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
