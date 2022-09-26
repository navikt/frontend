import type { NextApiRequest, NextApiResponse } from 'next'

import { logger } from "../../utils/logger";

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  logger.warn("I'm the backend. I'm logging before I reply to the client.")

  res.status(200).json({ name: 'Kari Normann' })
}
