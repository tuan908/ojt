import clsx from "clsx";

export function Done({isDone}: {isDone: boolean}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={4}
            stroke="currentColor"
            className={clsx(
                "w-7 h-7",
                !!isDone ? "text-icon-default" : "text-[#7d7e7e]"
            )}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
            />
        </svg>
    );
}
