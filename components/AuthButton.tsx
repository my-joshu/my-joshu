import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user && !user.is_anonymous ? (
    <div className="flex items-center gap-4 text-gray-400">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:from-blue-700 hover:to-teal-500 transition duration-300">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-lg bg-gradient-to-r from-blue-600 to-teal-400 text-white hover:from-blue-700 hover:to-teal-500 transition duration-300"
    >
      Login
    </Link>
  );
}
