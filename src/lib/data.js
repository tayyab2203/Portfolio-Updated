import fs from 'fs';
import path from 'path';
import { projects as defaultProjects } from '@/data/projects';
import { skills as defaultSkills } from '@/data/skills';
import { companyInfo as defaultCompanyInfo } from '@/data/company';

const dataDir = path.join(process.cwd(), 'src', 'data');

// Read projects from file
export function getProjects() {
  try {
    const filePath = path.join(dataDir, 'projects.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    }
    // Fallback to default projects if JSON doesn't exist
    return defaultProjects;
  } catch (error) {
    console.error('Error reading projects:', error);
    return defaultProjects;
  }
}

// Write projects to file
export function saveProjects(projects) {
  try {
    const filePath = path.join(dataDir, 'projects.json');
    fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
}

// Read skills from file
export function getSkills() {
  try {
    const filePath = path.join(dataDir, 'skills.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    }
    // Fallback to default skills
    return defaultSkills;
  } catch (error) {
    console.error('Error reading skills:', error);
    return defaultSkills;
  }
}

// Write skills to file
export function saveSkills(skills) {
  try {
    const filePath = path.join(dataDir, 'skills.json');
    fs.writeFileSync(filePath, JSON.stringify(skills, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving skills:', error);
    return false;
  }
}

// Read company info from file
export function getCompanyInfo() {
  try {
    const filePath = path.join(dataDir, 'company.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    }
    // Fallback to default company info
    return defaultCompanyInfo;
  } catch (error) {
    console.error('Error reading company info:', error);
    return defaultCompanyInfo;
  }
}

// Write company info to file
export function saveCompanyInfo(companyInfo) {
  try {
    const filePath = path.join(dataDir, 'company.json');
    fs.writeFileSync(filePath, JSON.stringify(companyInfo, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving company info:', error);
    return false;
  }
}
