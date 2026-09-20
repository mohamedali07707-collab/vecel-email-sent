import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import nodemailer from 'nodemailer';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قراءة ملفات الـ Front-end الثابتة
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// مسار عرض الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../view/index.html'));
});

// مسار استقبال البيانات وإرسال الإيميل
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'يرجى ملء جميع الحقول المطلوبة!' });
  }

  // إعداد النقل الآمن للمعلومات (سيتم قراءة البيانات من إعدادات Vercel لاحقاً للأمان)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'mail.iraqiweb.site',
    port: parseInt(process.env.EMAIL_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"نموذج الموقع" <${process.env.EMAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER, // البريد الذي سيستقبل الرسائل
    subject: `تواصل جديد من: ${name}`,
    html: `
      <div style="direction: rtl; font-family: Arial; padding: 20px; border: 1px solid #ccc;">
        <h2>رسالة جديدة من الموقع التعريفي</h2>
        <p><b>الاسم:</b> ${name}</p>
        <p><b>البريد:</b> ${email}</p>
        <p><b>الرسالة:</b></p>
        <p>${message}</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'فشل إرسال الرسالة، تحقق من الإعدادات.' });
    }
    res.status(200).json({ success: true, message: 'تم إرسال رسالتك بنجاح وبدون سيرفر معقد!' });
  });
});

// بدلاً من app.listen نقوم بتصدير التطبيق لمنصة Vercel
export default app;