import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";

export default async function NotFound() {
    return (
        <div className="w-full h-screen flex flex-col">
            <div className="px-12 py-8 flex items-center">
                <ArrowBackIos sx={{fontSize: "1.5rem"}} />
                <Link href="/home" className="text-base font-semibold">
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
