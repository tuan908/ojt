import Clear from "@mui/icons-material/Clear";
import {useCallback, type ReactNode} from "react";

type ColorHashtagProps = {
    color: string;
    children: ReactNode;
    onRemove: (index: number) => void;
    index: number;
};

export default function Hashtag({
    color,
    onRemove: handleRemove,
    children,
    index,
}: ColorHashtagProps) {
    const onClick = useCallback(() => handleRemove(index), [index]);

    return (
        <div className="flex items-center justify-center leading-none bg-white shadow-md rounded-xl px-2 py-3 gap-x-2">
            <span style={{color}} className="font-semibold">
                {children}
            </span>
            <button
                className="border-none outline-none flex items-center justify-center"
                onClick={onClick}
            >
                <Clear sx={{width: 16, height: 16}} />
            </button>
        </div>
    );
}
