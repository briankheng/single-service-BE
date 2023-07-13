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
      const barang = await prisma.barang.findUnique({
        where: {
          id: id as string,
        },
      });

      if (!barang) {
        return res.status(404).json({
          status: "error",
          message: "Barang tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Barang berhasil ditemukan",
        data: barang,
      });

    case "PUT":
      if (!authorized(token)) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized", data: null });
      }

      const { nama, harga, stok, kode, perusahaan_id } = req.body;

      const updatedBarang = await prisma.barang.update({
        where: {
          id: id as string,
        },
        data: {
          nama,
          harga,
          stok,
          kode,
          perusahaan_id,
        },
      });

      if (!updatedBarang) {
        return res.status(404).json({
          status: "error",
          message: "Barang tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Barang berhasil diperbarui",
        data: updatedBarang,
      });

    case "DELETE":
      if (!authorized(token)) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized", data: null });
      }

      const deletedBarang = await prisma.barang.delete({
        where: {
          id: id as string,
        },
      });

      if (!deletedBarang) {
        return res.status(404).json({
          status: "error",
          message: "Barang tidak ditemukan",
          data: null,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Barang berhasil dihapus",
        data: deletedBarang,
      });

    default:
      return res
        .status(405)
        .json({ status: "error", message: "Method not allowed", data: null });
  }
}
