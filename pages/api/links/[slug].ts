import Link, { LinkType } from '@/lib/server/models/linkModel';
import '@/lib/server/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { Error as MongooseErrors } from 'mongoose';

type Data = LinkType | { error: string | { [key in keyof Partial<LinkType>]: string } };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method, query, body } = req;
  if (method === 'GET') {
    try {
      const found = await Link.findOneAndUpdate({ slug: query.slug }, { $inc: { clicks: 1 } }, { new: true });
      if (found) {
        res.json(found);
      } else {
        res.status(404).json({ error: 'Link not found' });
      }
    } catch (err: unknown) {
      res.status(500).json({ error: 'There was an error' });
    }
  } else if (method === 'PATCH') {
    try {
      const found = await Link.findOneAndUpdate(
        { slug: query.slug, editable: true, editToken: body.editToken },
        { updated: Date.now(), url: body.url },
        { new: true, runValidators: true },
      );
      if (found) {
        res.json(found);
      } else {
        res.status(404).json({ error: 'Link not found' });
      }
    } catch (err: unknown) {
      if (err instanceof MongooseErrors.ValidationError) {
        const errors: { [key: string]: string } = {};
        Object.keys(err.errors).forEach((key) => {
          errors[key] = (<MongooseErrors.ValidationError>err).errors[key].message;
        });
        res.status(400).json({ error: errors });
        return;
      }
      res.status(500).json({ error: 'There was an error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
