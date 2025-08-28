import type { NextApiRequest, NextApiResponse } from "next";
// Prisma usage removed. This API route should be implemented in the backend only.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // This code should be handled by the backend. Return a 501 Not Implemented for now.
      res.status(501).json({ error: "Not implemented. Use backend API." });
    } catch {
      res.status(500).json({ error: "Failed to fetch available dates" });
    }
  } else if (req.method === "POST") {
    try {
      // This code should be handled by the backend. Return a 501 Not Implemented for now.
      res.status(501).json({ error: "Not implemented. Use backend API." });
    } catch {
      res.status(500).json({ error: "Failed to add date" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
