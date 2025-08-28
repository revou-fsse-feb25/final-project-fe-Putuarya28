import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Missing or invalid userId" });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const url = `${backendUrl}/bookings/customer/${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(req.headers.authorization
          ? { Authorization: req.headers.authorization }
          : {}),
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: unknown) {
    let message = "Internal server error";
    if (error instanceof Error) message = error.message;
    return res.status(500).json({ error: message });
  }
}
