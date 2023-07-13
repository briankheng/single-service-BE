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

  switch (req.method) {
    case "GET":
      const query = req.query.q as string;
      const perusahaan = req.query.perusahaan as string;

      if (!query && !perusahaan) {
        const allBarang = await prisma.barang.findMany();

        return res.status(200).json({
          status: "success",
          message: "Barang berhasil ditemukan",
          data: allBarang,
        });
      }

      if (perusahaan) {
        const perusahaanBarang = await prisma.barang.findMany({
          where: {
            perusahaan: {
              nama: perusahaan,
            },
          },
        });

        return res.status(200).json({
          status: "success",
          message: "Barang berhasil ditemukan",
          data: perusahaanBarang,
        });
      }

      const queryBarang = await prisma.barang.findMany({
        where: {
          OR: [
            {
              nama: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              kode: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Barang berhasil ditemukan",
        data: queryBarang,
      });

    case "POST":
      const token = req.headers.authorization;

      if (!authorized(token)) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized", data: null });
      }

      const { nama, harga, stok, perusahaan_id, kode } = req.body;

      const isExistPerusahaan = await prisma.perusahaan.findUnique({
        where: { id: perusahaan_id },
      });

      const isExistKode = await prisma.barang.findUnique({
        where: { kode },
      });

      if (!isExistPerusahaan || isExistKode || harga <= 0 || stok < 0) {
        return res.status(400).json({
          status: "error",
          message: "Something went wrong!",
          data: null,
        });
      }

      const barang = await prisma.barang.create({
        data: {
          nama,
          harga,
          stok,
          perusahaan_id,
          kode,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Barang berhasil ditambahkan",
        data: barang,
      });

    default:
      return res
        .status(405)
        .json({ status: "error", message: "Method not allowed", data: null });
  }
}
