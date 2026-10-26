import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first');

const file = path.resolve(process.cwd(), '..', 'data.txt');
const text = fs.readFileSync(file, 'utf8');
const students = [];
let className = null;

for (const rawLine of text.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line) continue;
  const classMatch = line.match(/^(11th|12th)\s+class$/i);
  if (classMatch) { className = classMatch[1].toLowerCase() + ' class'; continue; }
  const person = line.match(/^([^:]+):\s*(.+)$/);
  if (!person || !className) continue;
  const name = person[1].trim();
  const rest = person[2].trim();
  const phoneMatch = rest.match(/(?:^|[,\s])((?:\+?91[\s-]?)?\d[\d\s-]{8,}\d)\s*$/);
  if (!phoneMatch) { console.warn(`Skipping ${name}: no valid phone number`); continue; }
  const guardianPhone = phoneMatch[1].replace(/\D/g, '').replace(/^91(\d{10})$/, '$1');
  if (guardianPhone.length !== 10) { console.warn(`Skipping ${name}: invalid phone number`); continue; }
  const subjects = rest.slice(0, phoneMatch.index).replace(/[\s,]+$/, '').trim();
  students.push({ name, class_name: className, subjects, guardian_phone: guardianPhone, active: true });
}

const unique = [...new Map(students.map((s) => [`${s.name.toLowerCase()}|${s.class_name}`, s])).values()];
if (!unique.length) throw new Error('No valid students found in data.txt');
const db = createClient(url, key);
if (process.argv.includes('--replace')) {
  const { error } = await db.from('students').delete().not('id', 'is', null);
  if (error) throw error;
}
const { data, error } = await db.from('students').insert(unique).select('id,name,class_name,guardian_phone');
if (error) throw error;
console.log(`Imported ${data.length} students from ${file}`);
