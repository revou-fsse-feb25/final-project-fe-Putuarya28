import { getSession, signOut } from "next-auth/react";
import { refreshAccessToken } from "./auth";

/**
 * Fetch wrapper that automatically refreshes access token if expired.
 * Usage: await fetchWithAuth(url, options)
 */
export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const session = await getSession();
  let accessToken = session?.accessToken;
  let refreshToken = session?.refreshToken;
  const userId = session?.user?.id;

  console.log("[fetchWithAuth] Session:", session);
  // Attach access token to request
  const authInit = {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };

  let response = await fetch(input, authInit);
  console.log(
    "[fetchWithAuth] Initial fetch",
    input,
    "status:",
    response.status
  );

  // If unauthorized or forbidden, try to refresh token and retry
  if (
    (response.status === 401 || response.status === 403) &&
    refreshToken &&
    userId
  ) {
    console.log("[fetchWithAuth] Access token expired, attempting refresh...");
    try {
      const data = await refreshAccessToken(userId, refreshToken);
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
      console.log("[fetchWithAuth] Refresh successful, new tokens:", data);
      // Persist new tokens in NextAuth session using custom API
      await fetch("/api/auth/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      });
      // Add a short delay to ensure the cookie is set before retrying
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Retry original request with new access token
      const retryInit = {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      };
      response = await fetch(input, retryInit);
      console.log(
        "[fetchWithAuth] Retried fetch",
        input,
        "status:",
        response.status
      );
    } catch (err) {
      console.error("[fetchWithAuth] Refresh failed:", err);
      // If refresh fails, force sign-out (redirect to login)
      await signOut({ callbackUrl: "/login" });
      throw new Error("Session expired. Please sign in again.");
    }
  }

  // If still unauthorized/forbidden after refresh, force sign-out
  if (response.status === 401 || response.status === 403) {
    console.warn(
      "[fetchWithAuth] Still unauthorized after refresh, signing out."
    );
    await signOut({ callbackUrl: "/login" });
    throw new Error("Session expired. Please sign in again.");
  }

  return response;
}
