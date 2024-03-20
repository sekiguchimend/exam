import { NextApiRequest, NextApiResponse } from "next";

export default function sendGmail(req: NextApiRequest, res: NextApiResponse) {
    if (!res) {
        // エラー処理: res が未定義の場合
        return res.status(500).json({ error: "Response object is not defined" });
    }
   
    return res.status(200).json({ name: "shunya" });
}
