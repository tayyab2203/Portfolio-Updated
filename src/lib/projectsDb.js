import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import { projects as defaultProjects } from '@/data/projects';

const DB_NAME = process.env.MONGODB_DB || 'portfolio';
const COLLECTION = 'projects';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLLECTION);
}

// Normalize project data to ensure arrays are always arrays
function normalizeProject(project) {
  if (!project) return null;
  return {
    ...project,
    images: Array.isArray(project.images) ? project.images : [],
    techStack: Array.isArray(project.techStack) ? project.techStack : [],
    metrics: project.metrics || {},
  };
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
  return projects.map(normalizeProject);
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
  
  // Try both numeric and string ID to handle type mismatches
  let numericId = Number(id);
  if (isNaN(numericId)) {
    // If conversion fails, try string match
    const project = await collection.findOne({ id: String(id) });
    return normalizeProject(project);
  }
  
  // First try numeric ID
  let project = await collection.findOne({ id: numericId });
  
  // If not found, try string ID (in case DB has string IDs)
  if (!project) {
    project = await collection.findOne({ id: String(id) });
  }
  
  // If still not found, try finding by MongoDB _id (if it looks like an ObjectId)
  if (!project && typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      project = await collection.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      // Invalid ObjectId format, ignore
      console.log('Invalid ObjectId format:', id);
    }
  }
  
  // Debug: If still not found, log all project IDs to help diagnose
  if (!project) {
    const allProjects = await collection.find({}).projection({ id: 1, title: 1 }).toArray();
    console.error(`Project not found. Searched for ID: ${id} (type: ${typeof id}, numeric: ${numericId})`);
    console.error('Available project IDs in DB:', allProjects.map(p => ({ id: p.id, idType: typeof p.id, title: p.title })));
  }
  
  return normalizeProject(project);
}

export async function updateProject(id, data) {
  const collection = await getCollection();
  const numericId = Number(id);

  // Check if project exists first
  const existing = await collection.findOne({ id: numericId });
  if (!existing) {
    return null;
  }

  // Remove MongoDB internal fields that cannot be updated
  const { _id, ...updateData } = data;

  // Ensure images and techStack are arrays in the update
  const update = {
    ...updateData,
    id: numericId, // Keep the id field for our custom id
    images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
    techStack: Array.isArray(data.techStack) ? data.techStack : (data.techStack ? [data.techStack] : []),
    metrics: data.metrics || {},
  };

  const result = await collection.findOneAndUpdate(
    { id: numericId },
    { $set: update },
    { returnDocument: 'after' }
  );

  if (!result.value) {
    return null;
  }

  return normalizeProject(result.value);
}

export async function deleteProject(id) {
  const collection = await getCollection();
  const numericId = Number(id);
  const result = await collection.deleteOne({ id: numericId });
  return result.deletedCount > 0;
}

