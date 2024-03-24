export function fetchNoCache(
    url: string,
    method?: "GET" | "POST",
    body?: unknown
) {
    if (method && method === "POST") {
        return fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-cache",
        });
    } else {
        return fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-cache",
        });
    }
}
