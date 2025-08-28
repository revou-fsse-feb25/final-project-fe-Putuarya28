import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const dates = await prisma.availableDate.findMany();
      res.status(200).json(dates);
    } catch {
      res.status(500).json({ error: "Failed to fetch available dates" });
    }
  } else if (req.method === "POST") {
    try {
      const { date } = req.body;
      const newDate = await prisma.availableDate.create({ data: { date } });
      res.status(201).json(newDate);
    } catch {
      res.status(500).json({ error: "Failed to add date" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
