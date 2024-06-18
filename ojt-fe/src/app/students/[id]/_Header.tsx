import {ScreenMode, UserRole} from "@/constants";
import {type JwtPayload} from "@/services/auth.service";
import AddCircle from "@mui/icons-material/AddCircle";
import Link from "next/link";
import {type FC} from "react";

type HeaderProps = {auth?: JwtPayload};

const url = `/events?mode=${ScreenMode.NEW}`;

const Header: FC<HeaderProps> = async ({auth}) => {
    if (auth === undefined || auth.role !== UserRole.Student) {
        return null;
    }

    return (
        <div className="w-24/25 m-auto flex items-center pb-3">
            <Link
                href={url}
                className="flex gap-x-2 items-center px-6 py-2 bg-[#33b5e5] text-white rounded-lg"
            >
                <AddCircle />
                <span>新規作成</span>
            </Link>
        </div>
    );
};

export default Header;
