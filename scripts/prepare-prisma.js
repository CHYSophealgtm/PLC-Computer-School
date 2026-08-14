import fs from "fs";
import path from "path";

const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");

if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, "utf-8");
  
  const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
  const dbUrl = process.env.DATABASE_URL || process.env.PG_DATABASE_URL || "";
  
  if (isVercel || dbUrl.startsWith("postgres")) {
    console.log("--> Configuring Prisma schema for PostgreSQL (Supabase / Production)");
    schema = schema.replace(/provider\s*=\s*"(sqlite|postgresql)"/g, 'provider = "postgresql"');
    
    if (!schema.match(/url\s*=\s*env\("DATABASE_URL"\)/)) {
      schema = schema.replace(/url\s*=\s*.*$/m, 'url      = env("DATABASE_URL")');
    }
    
    if (!schema.includes("directUrl")) {
      schema = schema.replace(/url\s*=\s*env\("DATABASE_URL"\)/, 'url      = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")');
    }
  } else {
    console.log("--> Configuring Prisma schema for SQLite (Local Development)");
    schema = schema.replace(/provider\s*=\s*"(sqlite|postgresql)"/g, 'provider = "sqlite"');
    schema = schema.replace(/url\s*=\s*.*$/m, 'url      = "file:./dev.db"');
    
    // Split and filter to properly remove directUrl
    const lines = schema.split('\n');
    schema = lines.filter(line => !line.includes('directUrl')).join('\n');
  }
  
  fs.writeFileSync(schemaPath, schema, "utf-8");
}
