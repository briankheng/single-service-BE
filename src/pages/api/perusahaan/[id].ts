import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import authorized from "@/libs/authorized";
import prisma from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
  });

  const token = req.headers.authorization;
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      const perusahaan = await prisma.perusahaan.findUnique({
        where: {
          id: id as string,
        },
      });

      if (!perusahaan) {
        return res.status(404).json({
          status: "error",
          message: "Perusahaan tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Perusahaan berhasil ditemukan",
        data: perusahaan,
      });

    case "PUT":
      if (!authorized(token)) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized", data: null });
      }

      const updatedPerusahaan = await prisma.perusahaan.update({
        where: {
          id: id as string,
        },
        data: req.body,
      });

      if (!updatedPerusahaan) {
        return res.status(404).json({
          status: "error",
          message: "Perusahaan tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Perusahaan berhasil diperbarui",
        data: updatedPerusahaan,
      });

    case "DELETE":
      if (!authorized(token)) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized", data: null });
      }

      const deletedPerusahaan = await prisma.perusahaan.delete({
        where: {
          id: id as string,
        },
      });

      if (!deletedPerusahaan) {
        return res.status(404).json({
          status: "error",
          message: "Perusahaan tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Perusahaan berhasil dihapus",
        data: deletedPerusahaan,
      });

    default:
      return res
        .status(405)
        .json({ status: "error", message: "Method not allowed", data: null });
  }
}
