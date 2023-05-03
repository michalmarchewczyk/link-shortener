import Link, { LinkType } from '@/lib/server/models/linkModel';
import '@/lib/server/database';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = LinkType | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method, query } = req;
  if (method === 'GET') {
    try {
      const found = await Link.findOneAndUpdate({ slug: query.slug }, { $inc: { clicks: 1 } }, { new: true });
      if (found) {
        res.json(found);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    } catch (err: unknown) {
      res.status(500).json({ error: 'There was an error' });
    }
  }
}
