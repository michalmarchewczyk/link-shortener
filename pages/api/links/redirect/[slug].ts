import Link, { LinkType } from '@/lib/server/models/linkModel';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = LinkType | { error: string | { [key in keyof Partial<LinkType>]: string } };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method, query } = req;
  if (method === 'GET') {
    try {
      const found = await Link.findOneAndUpdate({ slug: query.slug }, { $inc: { clicks: 1 } });
      if (found) {
        res.redirect(found.url);
      } else {
        res.redirect('/404');
      }
    } catch (err: unknown) {
      res.status(500).json({ error: 'There was an error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
