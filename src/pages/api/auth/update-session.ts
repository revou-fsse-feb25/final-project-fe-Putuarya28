import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { accessToken, refreshToken } = req.body;
  if (!accessToken || !refreshToken)
    return res.status(400).json({ error: "Missing tokens" });

  // Get the current token
  const token = await getToken({ req, secret });
  if (!token) return res.status(401).json({ error: "No session" });

  // Update the token values
  token.accessToken = accessToken;
  token.refreshToken = refreshToken;

  // Set the updated token as a cookie (NextAuth uses this for session)
  setCookie({ res }, "next-auth.session-token", JSON.stringify(token), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res.status(200).json({ ok: true });
}
