import clientPromise from './mongodb';
import { skills as defaultSkills } from '@/data/skills';

const DB_NAME = process.env.MONGODB_DB || 'portfolio';
const COLLECTION = 'skills';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLLECTION);
}

// Normalize the skills object into an array of categories
function normalizeSkillsObject(skillsObj) {
  return Object.entries(skillsObj).map(([key, value]) => ({
    key,
    category: value.category,
    skills: (value.skills || []).map((skill) => ({
      name: skill.name,
      level: skill.level,
      years: skill.years,
      // Store icon as string key if available
      iconKey: skill.icon?.name || null,
    })),
  }));
}

export async function getSkillsForPublic() {
  const collection = await getCollection();

  // Seed from static data if collection is empty
  const count = await collection.countDocuments();
  if (count === 0 && defaultSkills) {
    const normalized = normalizeSkillsObject(defaultSkills);
    await collection.insertOne({
      slug: 'default',
      categories: normalized,
    });
  }

  const doc =
    (await collection.findOne({ slug: 'default' })) ||
    (await collection.findOne({}));

  if (!doc) {
    return normalizeSkillsObject(defaultSkills);
  }

  return doc.categories || normalizeSkillsObject(defaultSkills);
}

