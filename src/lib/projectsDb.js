import clientPromise from './mongodb';
import { projects as defaultProjects } from '@/data/projects';

const DB_NAME = process.env.MONGODB_DB || 'portfolio';
const COLLECTION = 'projects';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLLECTION);
}

export async function getAllProjects() {
  const collection = await getCollection();

  // Seed from static data if collection is empty
  const count = await collection.countDocuments();
  if (count === 0 && defaultProjects?.length) {
    await collection.insertMany(
      defaultProjects.map((p, index) => ({
        ...p,
        id: typeof p.id === 'number' ? p.id : index + 1,
      }))
    );
  }

  const projects = await collection.find({}).sort({ id: 1 }).toArray();
  return projects;
}

export async function createProject(data) {
  const collection = await getCollection();

  const last = await collection.find({}).sort({ id: -1 }).limit(1).toArray();
  const lastId = last[0]?.id ?? 0;
  const newId = lastId + 1;

  const newProject = {
    id: newId,
    featured: false,
    images: [],
    techStack: [],
    metrics: {},
    ...data,
  };

  await collection.insertOne(newProject);
  return newProject;
}

export async function getProjectById(id) {
  const collection = await getCollection();
  const numericId = Number(id);
  return collection.findOne({ id: numericId });
}

export async function updateProject(id, data) {
  const collection = await getCollection();
  const numericId = Number(id);

  const update = {
    ...data,
    id: numericId,
  };

  const result = await collection.findOneAndUpdate(
    { id: numericId },
    { $set: update },
    { returnDocument: 'after' }
  );

  return result.value;
}

export async function deleteProject(id) {
  const collection = await getCollection();
  const numericId = Number(id);
  const result = await collection.deleteOne({ id: numericId });
  return result.deletedCount > 0;
}

