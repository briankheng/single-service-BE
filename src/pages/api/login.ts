import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import prisma from "@/libs/prisma";
import { sign } from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
  });

  if (req.method !== "POST")
    return res
      .status(405)
      .json({ status: "error", message: "Method not allowed", data: null });

  const { username, password } = req.body;

  const admin = await prisma.admin.findFirst({
    where: {
      username,
      password,
    },
  });

  if (!admin)
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials", data: null });

  const token = sign(
    {
      id: admin.id,
      username: admin.username,
      name: admin.name,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "365d" }
  );

  return res.status(200).json({
    status: "success",
    message: "Login success",
    data: {
      user: {
        username: admin.username,
        name: admin.name,
      },
      token: token,
    },
  });
}
