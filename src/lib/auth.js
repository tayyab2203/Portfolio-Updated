import * as jose from 'jose';
import bcrypt from 'bcryptjs';

const IS_PROD = process.env.NODE_ENV === 'production';

// JWT secret
const RAW_JWT_SECRET = process.env.JWT_SECRET || (!IS_PROD ? 'dev-jwt-secret-change-me' : '');
if (IS_PROD && !RAW_JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable must be set in production');
}
const JWT_SECRET = RAW_JWT_SECRET;

// Admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || (!IS_PROD ? 'admin' : '');
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const DEV_FALLBACK_PASSWORD = 'admin123';

// Generate password hash (use this to create initial password)
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token (jose works in Node and Edge)
export async function generateToken(userId) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const jwt = await new jose.SignJWT({ userId }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret);
  return jwt;
}

// Verify JWT token (Edge-compatible for middleware)
export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated(req) {
  const token = req.cookies?.adminToken || req.headers?.authorization?.replace('Bearer ', '');
  if (!token) return false;
  
  const decoded = await verifyToken(token);
  return decoded !== null;
}

// Login function
export async function login(username, password) {
  // For now, using environment variables
  // In production, you'd check against a database
  
  // Normalize username comparison (case-insensitive, trim whitespace)
  const normalizedUsername = username.trim();
  const normalizedAdminUsername = ADMIN_USERNAME.trim();
  
  if (normalizedUsername.toLowerCase() !== normalizedAdminUsername.toLowerCase()) {
    return { success: false, error: 'Invalid credentials' };
  }

  // If ADMIN_PASSWORD_HASH is set and is a valid bcrypt hash, verify against it.
  // In development only, fall back to plain-text DEV_FALLBACK_PASSWORD to make setup easy.
  let isValidPassword = false;

  if (ADMIN_PASSWORD_HASH && (ADMIN_PASSWORD_HASH.startsWith('$2a$') || ADMIN_PASSWORD_HASH.startsWith('$2y$') || ADMIN_PASSWORD_HASH.startsWith('$2b$'))) {
    try {
      // Convert $2y$ to $2a$ format if needed (bcryptjs uses $2a$)
      const hashToVerify = ADMIN_PASSWORD_HASH.startsWith('$2y$') 
        ? ADMIN_PASSWORD_HASH.replace('$2y$', '$2a$')
        : ADMIN_PASSWORD_HASH;
      isValidPassword = await verifyPassword(password, hashToVerify);
    } catch (error) {
      console.error('Password verification error:', error);
      if (!IS_PROD) {
        // Fallback to plain text comparison in development only
        isValidPassword = password === DEV_FALLBACK_PASSWORD;
      }
    }
  } else if (!IS_PROD) {
    // Fallback for development - plain text comparison
    isValidPassword = password === DEV_FALLBACK_PASSWORD;
  }

  if (!isValidPassword) {
    console.log('Password mismatch');
    return { success: false, error: 'Invalid credentials' };
  }

  const token = await generateToken(ADMIN_USERNAME);
  return { success: true, token };
}
