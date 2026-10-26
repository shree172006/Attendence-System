import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const text = fs.readFileSync(path.resolve(process.cwd(), '..', 'data.txt'), 'utf8');
const source = []; let className = '';
for (const raw of text.split(/\r?\n/)) { const line = raw.trim(); if (!line) continue; const cls = line.match(/^(11th|12th)\s+class$/i); if (cls) { className = cls[1].toLowerCase() + ' class'; continue; } const match = line.match(/^([^:]+):\s*(.+)$/); if (!match || !className) continue; const digits = match[2].match(/(?:\+?91[\s-]?)?\d[\d\s-]{8,}\d/g) || []; const phones = [...new Set(digits.map((p) => p.replace(/\D/g, '').replace(/^91(\d{10})$/, '$1')).filter((p) => p.length === 10))]; if (phones.length) source.push({ name: match[1].trim(), className, phones }); }
const { data: students, error: studentError } = await db.from('students').select('id,name,class_name'); if (studentError) throw studentError;
const rows = []; const missing = [];
for (const item of source) { const student = students.find((s) => s.name.toLowerCase() === item.name.toLowerCase() && s.class_name === item.className); if (!student) { missing.push(item.name); continue; } item.phones.forEach((phone, index) => rows.push({ student_id: student.id, guardian_name: '', phone, is_primary: index === 0 })); }
const { error } = await db.from('student_guardians').upsert(rows, { onConflict: 'student_id,phone' }); if (error) throw error; console.log(`Imported ${rows.length} guardian phone records.`); if (missing.length) console.log(`Students not matched: ${missing.join(', ')}`);
