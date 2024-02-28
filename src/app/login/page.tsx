import Https from "@mui/icons-material/Https";
import PersonOutline from "@mui/icons-material/PersonOutline";
import {login} from "../actions/login";

export default async function Page() {
    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
            <div
                className="rounded-t-lg h-36 bg-cover"
                style={{
                    backgroundImage:
                        "url('https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/418313608_855462943043217_191289349546480181_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=3635dc&_nc_ohc=DsKTzqTyTtgAX-HZbYl&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfAri_IB44mLxCPXcj_sxIwFkqyHFSMwK1DIEMdkR7WhMg&oe=65E37168')",
                }}
            ></div>
            <form
                action={login}
                className="p-12 bg-white flex flex-col gap-y-4"
            >
                <div className="flex">
                    <div className="border-b border-b-[#333]">
                        <PersonOutline />
                    </div>
                    <input type="text" className="border-b border-b-[#333]" />
                </div>
                <div className="flex">
                    <div className="border-b border-b-[#333]">
                        <Https />
                    </div>
                    <input
                        type="password"
                        className="border-b border-b-[#333]"
                    />
                </div>

                <div className="w-full h-full flex items-center justify-center py-2">
                    <input
                        type="submit"
                        value="ログイン"
                        className="bg-[#407ed9] text-white font-bold px-4 py-1 m-auto rounded-xl text-sm"
                    />
                </div>
            </form>
        </div>
    );
}
