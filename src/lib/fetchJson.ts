export async function fetchJson<T = unknown>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    if (isJson) {
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const message =
        (data && (data.error || data.message)) || `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    const body = await res.text();
    throw new Error(
      `Expected JSON but received ${contentType || 'unknown content-type'} (status ${res.status}). Body: ${body.slice(0, 200)}`
    );
  }

  if (!isJson) {
    const body = await res.text();
    throw new Error(
      `Expected JSON but received ${contentType || 'unknown content-type'} (status ${res.status}). Body: ${body.slice(0, 200)}`
    );
  }

  return res.json() as Promise<T>;
}
