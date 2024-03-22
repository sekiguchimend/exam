import { NextApiRequest, NextApiResponse } from "next";

export default function sendGmail(req: NextApiRequest, res: NextApiResponse) {
  // リクエストの処理など

  // エラー処理
  if (!req) {
    return res.status(500).json({ error: "Request object is not defined" });
  }

  return res.status(200).json({ name: "shunya" });
}