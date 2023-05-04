import { InferSchemaType, Model, model, models, Schema } from 'mongoose';
import cryptoRandomString from 'crypto-random-string';
import validator from 'validator';

const linkSchema = new Schema({
  url: {
    type: String,
    required: [true, 'URL is required'],
    validate: {
      validator: (url: string) => validator.isURL(url),
      message: (props: { value: string }) => `${props.value} is not a valid URL`,
    },
    set: (url: string) => {
      if (url && !url.startsWith('http')) {
        return `http://${url}`;
      }
      return url;
    },
  },
  slug: {
    type: String,
    default: () => cryptoRandomString({ length: 8, type: 'alphanumeric' }),
    unique: true,
    trim: true,
    minLength: ['2', 'Slug must be at least 2 characters long'],
    maxLength: ['60', 'Slug must be at most 60 characters long'],
    validate: {
      validator: (slug: string) => validator.isSlug(slug.toLowerCase()),
      message: () => 'Slug must contain only alphanumeric characters or hyphens',
    },
  },
  clicks: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  editable: {
    type: Boolean,
    default: false,
    immutable: true,
  },
  editToken: {
    type: String,
    default: (val: { editable: boolean }) => (val.editable ? cryptoRandomString({ length: 32, type: 'base64' }) : null),
    select: false,
  },
});

const Link: Model<LinkType> = models.Link || model('Link', linkSchema);

export type LinkType = InferSchemaType<typeof linkSchema>;

export default Link;
