import Check from "@mui/icons-material/Check";

export default async function Done({isDone}: {isDone: boolean}) {
    return (
        <Check
            sx={{
                width: 32,
                height: 32,
                stroke: !isDone ? "#31bafd" : "#7d7e7e",
                strokeWidth: 2,
                ":hover": {
                    cursor: isDone ? "not-allowed" : "pointer",
                },
            }}
        />
    );
}
