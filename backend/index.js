import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
const port = process.env.PORT || 3001;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
let whatsappClient = null;
let whatsappReady = false;
const requireDb = (res) => { if (!db) { res.status(503).json({ message: 'Supabase is not configured' }); return false; } return true; };

app.get('/api/health', (_req, res) => res.json({ ok: true, database: Boolean(db), whatsapp: whatsappReady }));
app.get('/api/students', async (_req, res) => { if (!requireDb(res)) return; const { data, error } = await db.from('students').select('*').eq('active', true).order('name'); if (error) return res.status(500).json({ message: error.message }); res.json(data); });
app.post('/api/students', async (req, res) => { if (!requireDb(res)) return; const { name, className, subjects, guardianName, guardianPhone } = req.body; if (!name || !className || !guardianPhone) return res.status(400).json({ message: 'name, className and guardianPhone are required' }); const { data, error } = await db.from('students').insert({ name, class_name: className, subjects: subjects || '', guardian_name: guardianName || '', guardian_phone: guardianPhone }).select().single(); if (error) return res.status(400).json({ message: error.message }); res.status(201).json(data); });
app.put('/api/students/:id', async (req, res) => { if (!requireDb(res)) return; const allowed = {}; for (const [key, value] of Object.entries({ name: req.body.name, class_name: req.body.className, subjects: req.body.subjects, guardian_name: req.body.guardianName, guardian_phone: req.body.guardianPhone, active: req.body.active })) if (value !== undefined) allowed[key] = value; const { data, error } = await db.from('students').update(allowed).eq('id', req.params.id).select().single(); if (error) return res.status(400).json({ message: error.message }); res.json(data); });
app.delete('/api/students/:id', async (req, res) => { if (!requireDb(res)) return; const { error } = await db.from('students').update({ active: false }).eq('id', req.params.id); if (error) return res.status(400).json({ message: error.message }); res.status(204).end(); });
app.get('/api/batches', async (_req, res) => { if (!requireDb(res)) return; const { data, error } = await db.from('batches').select('*').order('created_at'); if (error) return res.status(500).json({ message: error.message }); res.json(data); });
app.post('/api/batches', async (req, res) => { if (!requireDb(res)) return; const { name, className, lectureType, startTime, endTime } = req.body; const { data, error } = await db.from('batches').insert({ name, class_name: className, lecture_type: lectureType, start_time: startTime, end_time: endTime }).select().single(); if (error) return res.status(400).json({ message: error.message }); res.status(201).json(data); });
app.delete('/api/batches/:id', async (req, res) => { if (!requireDb(res)) return; const { error } = await db.from('batches').delete().eq('id', req.params.id); if (error) return res.status(400).json({ message: error.message }); res.status(204).end(); });
app.post('/api/attendance', async (req, res) => { if (!requireDb(res)) return; const { batchId, date, records } = req.body; if (!batchId || !date || !Array.isArray(records)) return res.status(400).json({ message: 'batchId, date and records are required' }); const rows = records.map((record) => ({ batch_id: batchId, student_id: record.studentId || record.id, date, status: record.status, time_in: record.in || null, time_out: record.out || null })); const { data, error } = await db.from('attendance').upsert(rows, { onConflict: 'batch_id,student_id,date' }).select(); if (error) return res.status(400).json({ message: error.message }); const absent = records.filter((record) => record.status === 'absent'); const notification = await notifyParents(records, date, saved); res.status(201).json({ records: data, notification }); });

async function notifyParents(records, date, attendanceRows) {
  if (!whatsappReady) return { sent: false, message: 'Attendance saved; WhatsApp is not connected' };
  const ids = records.map((record) => record.studentId || record.id).filter(Boolean);
  const { data: students, error } = await db.from('students').select('id,name').in('id', ids);
  if (error) return { sent: false, message: error.message };
  const { data: guardians } = await db.from('student_guardians').select('student_id,phone').in('student_id', ids);
  const primary = await db.from('students').select('id,guardian_phone').in('id', ids);
  const phones = [...(guardians || []), ...((primary.data || []).filter((row) => row.guardian_phone).map((row) => ({ student_id: row.id, phone: row.guardian_phone })) )];
  const sent = [], failed = [];
  for (const record of records) {
    const student = (students || []).find((item) => String(item.id) === String(record.studentId || record.id));
    if (!student) continue;
    const targets = [...new Map(phones.filter((item) => String(item.student_id) === String(student.id)).map((item) => [item.phone, item.phone])).values()];
    const message = `Shree Sai Classes\\n\\nStudent: ${student.name}\\nDate: ${date}\\nStatus: ${record.status === 'present' ? 'Present' : 'Absent'}\\nTime: ${record.in || '-'} - ${record.out || '-'}`;
    for (const raw of targets) {
      let number = String(raw).replace(/\\D/g, ''); if (number.length === 10) number = `91${number}`;
      try { await whatsappClient.sendMessage(`${number}@c.us`, message); sent.push({ student: student.name, phone: raw }); if (db) await db.from('attendance_notifications').insert({ attendance_id: attendanceRows?.find((row) => String(row.student_id) === String(student.id))?.id || null, student_id: student.id, phone: raw, status: 'sent', message, sent_at: new Date().toISOString() }); }
      catch (error) { failed.push({ student: student.name, phone: raw, error: error.message }); if (db) await db.from('attendance_notifications').insert({ attendance_id: attendanceRows?.find((row) => String(row.student_id) === String(student.id))?.id || null, student_id: student.id, phone: raw, status: 'failed', message, error_message: error.message }); }
    }
  }
  return { sent: true, sentCount: sent.length, failedCount: failed.length, failed };
}async function startWhatsApp() { if (process.env.ENABLE_WHATSAPP !== 'true') return; try { const { Client, LocalAuth } = (await import('whatsapp-web.js')).default; const { default: qrcode } = await import('qrcode-terminal'); const chrome = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe','C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find((item) => fs.existsSync(item)); if (!chrome) return console.warn('WhatsApp disabled: Chrome/Edge not found'); whatsappClient = new Client({ authStrategy: new LocalAuth(), puppeteer: { executablePath: chrome, args: ['--no-sandbox'] } }); whatsappClient.on('qr', (qr) => qrcode.generate(qr, { small: true })); whatsappClient.on('ready', () => { whatsappReady = true; console.log('WhatsApp ready'); }); whatsappClient.on('auth_failure', console.error); await whatsappClient.initialize(); } catch (error) { console.warn('WhatsApp unavailable:', error.message); } }
app.listen(port, '0.0.0.0', () => console.log(`API listening on ${port}`));
startWhatsApp();

