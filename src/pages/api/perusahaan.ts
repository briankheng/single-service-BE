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

      if (!query) {
        const allPerusahaan = await prisma.perusahaan.findMany();

        return res.status(200).json({
          status: "success",
          message: "Perusahaan berhasil ditemukan",
          data: allPerusahaan,
        });
      }

      const validPerusahaan = await prisma.perusahaan.findMany({
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
        message: "Perusahaan berhasil ditemukan",
        data: validPerusahaan,
      });

    case "POST":
      const token = req.headers.authorization;

      if (!authorized(token)) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized", data: null });
      }

      const { nama, alamat, no_telp, kode } = req.body;

      const isValidKode = kode.length === 3 && /^[A-Z]+$/.test(kode);

      if (!isValidKode) {
        return res.status(400).json({
          status: "error",
          message: "Something went wrong!",
          data: null,
        });
      }

      const perusahaan = await prisma.perusahaan.create({
        data: {
          nama,
          alamat,
          no_telp,
          kode,
        },
      });

      return res.status(200).json({
        status: "success",
        message: "Perusahaan berhasil ditambahkan",
        data: perusahaan,
      });

    default:
      return res
        .status(405)
        .json({ status: "error", message: "Method not allowed", data: null });
  }
}
