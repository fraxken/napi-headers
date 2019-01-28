declare namespace napi_headers {
    export function napi(dest: string, version?: string): void;
    export function nodeAddonApi(dest: string, version?: string): void;
}

export as namespace napi_headers;
export = napi_headers;
