import { nullsToUndefined } from "@/utils";

export type HttpMethod = "GET" | "POST" | "DELETE";

type RequestOptions = RequestInit & {
    params?: Record<string, string>;
};

class HttpError extends Error {
    constructor(public response: Response) {
        super(`HTTP Error ${response.status}`);
        this.name = "HttpError";
    }
}

class HttpClient {
    private _baseUrl: string;

    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
    }

    private async request<T>(
        url: string,
        method: HttpMethod,
        options: RequestOptions = {}
    ) {
        const { params, headers, ...restOptions } = options;

        const queryParams = params ? `?${new URLSearchParams(params)}` : "";
        const fullUrl = `${this._baseUrl}${url}${queryParams}`;

        const defaultHeaders: HeadersInit = {
            "Content-Type": "application/json",
            Accept: "application/json",
        };

        try {
            const response = await fetch(fullUrl, {
                ...restOptions,
                method,
                headers: { ...defaultHeaders, ...headers },
            });

            if (!response.ok) {
                throw new HttpError(response);
            }

            const data = (await response.json()) as T;

            return nullsToUndefined(data);
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    public async get<T>(url: string, options?: RequestOptions) {
        return this.request<T>(url, "GET", options);
    }

    public async post<T>(url: string, data?: any, options?: RequestOptions) {
        return this.request<T>(url, "POST", {
            ...options,
            body: JSON.stringify(data),
        });
    }

    public async delete<T>(url: string, options?: RequestOptions) {
        return this.request<T>(url, "DELETE", options);
    }

    public async uploadFile(url: string, file: File, options?: RequestOptions) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${this._baseUrl}${url}`, {
            ...options,
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new HttpError(response);
        }

        return response.json();
    }

    public async downloadFile(url: string, filename: string): Promise<void> {
        const response = await fetch(`${this._baseUrl}${url}`);

        if (!response.ok) {
            throw new HttpError(response);
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}

export const springApi = new HttpClient(process.env["SPRING_API"]!);
export const honoApi = new HttpClient(process.env["HONO_API"]!);
