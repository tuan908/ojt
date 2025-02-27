import { cn } from "@/utils";
import { useMediaQuery } from "@mui/material";
import { type ComponentProps } from "react";
import { MEDIA_QUERY } from "@/constants";

const Textarea = ({
    name,
    placeholder,
    onChange,
    fullWidth,
    ...otherProps
}: ComponentProps<"textarea"> & { fullWidth?: boolean }) => {
    const matches = useMediaQuery(MEDIA_QUERY.LG);

    return (
        <textarea
            {...otherProps}
            className={cn(
                "resize-none border rounded-md px-4 py-1 outline-blue-500 disabled:cursor-not-allowed",
                fullWidth && "w-full"
            )}
            name={name}
            placeholder={placeholder}
            cols={30}
            rows={matches ? 2 : 1}
            onChange={onChange}
        />
    );
};

export default Textarea;
