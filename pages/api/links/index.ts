// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import '@/lib/server/database';
import Link, { LinkType } from '@/lib/server/models/linkModel';
import { MongoServerError } from 'mongodb';
import { Error as MongooseErrors } from 'mongoose';

type Data = LinkType | { error: string | { [key in keyof Partial<LinkType>]: string } };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method, body } = req;

  if (method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const link = await Link.create({
      url: body.url,
      slug: body.slug,
    });

    res.status(201).json(link);
  } catch (err: unknown) {
    if (err instanceof MongoServerError && err.code === 11000) {
      res.status(409).json({ error: { slug: 'Slug already exists' } });
      return;
    }
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
}
