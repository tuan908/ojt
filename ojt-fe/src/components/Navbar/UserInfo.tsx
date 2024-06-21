import {getValidToken} from "@/app/actions/event.action";
import json from "@/i18n/jp.json";
import {convertRole} from "@/utils";

// TODO: Remove flicker when set user info
export default async function UserInfo() {
    const auth = await getValidToken();

    return (
        <div className="flex flex-col">
            <h1 className="text-xl font-normal text-[#abb7bc]">
                {json.common.hello} {auth?.name}
            </h1>
            <h1 className="text-[#c3cbcf]">{convertRole(auth?.role)}</h1>
        </div>
    );
}
