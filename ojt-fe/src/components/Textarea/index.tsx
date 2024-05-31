import Utils from "@/utils";
import {type ComponentProps} from "react";

const Textarea = ({
    name,
    placeholder,
    onChange,
    fullWidth,
    ...otherProps
}: ComponentProps<"textarea"> & {fullWidth?: boolean}) => {
    return (
        <textarea
            {...otherProps}
            className={Utils.cn(
                "resize-none border rounded-md px-4 py-2 outline-blue-500 disabled:cursor-not-allowed",
                fullWidth && "w-full"
            )}
            name={name}
            placeholder={placeholder}
            cols={30}
            rows={2}
            onChange={onChange}
        />
    );
};

export default Textarea;
