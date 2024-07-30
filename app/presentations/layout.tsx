import Link from "next/link";
import AuthButton from "@/components/AuthButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 w-full flex flex-col gap-16 items-center bg-gray-900 text-white">
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-gray-700 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <Link href="/">
              <p className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
                MyJoshu
              </p>
            </Link>
            <AuthButton />
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}
