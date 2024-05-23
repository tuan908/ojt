import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import Link from "next/link";

export default async function NotFound() {
    return (
        <div className="w-full h-screen flex flex-col">
            <div className="px-12 py-8 flex items-center">
                <ArrowBackIos sx={{fontSize: "1.5rem"}} />
                <Link href="/" className="text-xl">
                    Back to home
                </Link>
            </div>
            <div className="w-full flex-1 flex flex-col items-center justify-center gap-y-4">
                <h1 className="text-9xl">404</h1>
                <h3 className="text-lg">Page not found</h3>
            </div>
        </div>
    );
}
