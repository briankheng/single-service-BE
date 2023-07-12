import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
  });
  
  if (req.method !== "GET")
    return res
      .status(405)
      .json({ status: "error", message: "Method not allowed", data: null });

  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized", data: null });
  }

  const decoded = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  return res.status(200).json({
    status: "success",
    message: "Authorized",
    data: { username: decoded.username, name: decoded.name },
  });
}
