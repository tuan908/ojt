/**
 * fetch with no cache setup
 * @param url Api URL
 * @param method GET/POST only
 * @param body raw body
 * @returns Response
 * @author Tuanna
 * @since v1.0
 */
export function fetchNoCache(
    endpoint: string,
    method?: "GET" | "POST",
    body?: unknown
) {
    const url = `${process.env["SPRING_API"]}${endpoint}`;

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
