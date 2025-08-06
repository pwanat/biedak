import { getAuth } from "@clerk/tanstack-react-start/server";

export const getClerkUserId = async (request: Request) => {
  const clerkRequest = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    cache: request.cache,
    credentials: request.credentials,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });

  const { userId } = await getAuth(clerkRequest);
  return userId;
  //  const user = userId ? await clerkClient().users.getUser(userId) : null
};
