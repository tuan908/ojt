import { UserRole } from "@/constants";
import { verifySession } from "@/lib/dal";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
    const session = await verifySession();

    let href = "";
    if (!session) {
        href = "/signin";
    } else if (session?.role === UserRole.Student) {
        href = "/students/" + session?.code;
    } else {
        href = "/students";
    }

    return (
        <div className="w-full h-screen flex flex-col">
            <div className="px-12 py-8 flex items-center">
                <ChevronLeft size="1.5rem" />
                <Link href={href} className="text-base font-semibold">
                    ホームページに戻ります
                </Link>
            </div>
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-9xl font-semibold">404</h1>
                <h3 className="text-4xl font-semibold">
                    ページが見つかりません
                </h3>
            </div>
        </div>
    );
}
