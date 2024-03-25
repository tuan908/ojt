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
