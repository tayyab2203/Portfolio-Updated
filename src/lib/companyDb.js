import clientPromise from './mongodb';
import {
  companyInfo as defaultCompanyInfo,
  team as defaultTeam,
  achievements as defaultAchievements,
  vision as defaultVision,
  mission as defaultMission,
  values as defaultValues,
  milestones as defaultMilestones,
} from '@/data/company';

const DB_NAME = process.env.MONGODB_DB || 'portfolio';
const COLLECTION = 'company';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLLECTION);
}

async function ensureSeeded(collection) {
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertOne({
      slug: 'default',
      companyInfo: defaultCompanyInfo,
      team: defaultTeam,
      achievements: defaultAchievements,
      vision: defaultVision,
      mission: defaultMission,
      values: defaultValues,
      milestones: defaultMilestones,
    });
  }
}

export async function getCompanyData() {
  const collection = await getCollection();

  await ensureSeeded(collection);

  const doc =
    (await collection.findOne({ slug: 'default' })) ||
    (await collection.findOne({}));

  if (!doc) {
    return {
      companyInfo: defaultCompanyInfo,
      team: defaultTeam,
      achievements: defaultAchievements,
      vision: defaultVision,
      mission: defaultMission,
      values: defaultValues,
      milestones: defaultMilestones,
    };
  }

  return {
    companyInfo: doc.companyInfo ?? defaultCompanyInfo,
    team: doc.team ?? defaultTeam,
    achievements: doc.achievements ?? defaultAchievements,
    vision: doc.vision ?? defaultVision,
    mission: doc.mission ?? defaultMission,
    values: doc.values ?? defaultValues,
    milestones: doc.milestones ?? defaultMilestones,
  };
}

export async function updateCompanyData(data) {
  const collection = await getCollection();

  const updateDoc = {
    ...(data.companyInfo && { companyInfo: data.companyInfo }),
    ...(data.team && { team: data.team }),
    ...(data.achievements && { achievements: data.achievements }),
    ...(data.vision && { vision: data.vision }),
    ...(data.mission && { mission: data.mission }),
    ...(data.values && { values: data.values }),
    ...(data.milestones && { milestones: data.milestones }),
  };

  await collection.updateOne(
    { slug: 'default' },
    {
      $set: {
        slug: 'default',
        ...updateDoc,
      },
    },
    { upsert: true }
  );

  return getCompanyData();
}

