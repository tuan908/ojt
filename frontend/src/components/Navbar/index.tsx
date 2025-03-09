import { Route, UserRole } from "@/constants";
import json from "@/i18n/jp.json";
import { verifySession } from "@/lib/dal";
import { convertRole } from "@/lib/utils";
import Link from "next/link";
import ActionMenu from "./ActionMenu";
import Sidebar from "./Sidebar";

export default async function Navbar() {
    const auth = await verifySession();
    const href =
        auth?.role !== UserRole.Student
            ? Route.Students
            : `/students/${auth?.code}`;
    return (
        <nav className="w-full py-2 px-4 flex justify-between items-center z-50 fixed top-0 left-0 shadow-md bg-white">
            <div className="flex flex-row gap-x-4 items-center">
                <Sidebar auth={auth} />
                <Link
                    className="text-[#1f5da3] font-extrabold text-3xl"
                    href={href}
                >
                    {json.common.application_name}
                </Link>
            </div>
            <div className="hidden items-center justify-between gap-x-2 lg:flex">

               <ActionMenu name={auth?.name} />

                {/* Username */}
                <div className="flex flex-col">
                    <h1 className="text-xl font-normal text-[#abb7bc]">
                        {json.common.hello} {auth?.name}
                    </h1>
                    <h1 className="text-[#c3cbcf]">
                        {convertRole(auth?.role)}
                    </h1>
                </div>
            </div>
        </nav>
    );
}
