import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      dbName: 'link-shortener',
      autoCreate: true,
    });
  } catch (err: unknown) {
    // ignore
  }
};

(async () => {
  await connectDb();
})();
