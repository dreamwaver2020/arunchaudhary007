const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// यदि तपाइँको CSS वा Images 'public' फोल्डरमा छ भने यो लाइन चाहिन्छ
app.use(express.static('public')); 

// १. MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected: Aruns Data Cluster"))
  .catch(err => console.error("❌ Connection Error:", err));

// २. Schemas (डेटाको संरचना)

// Login Log को लागि
const userSchema = new mongoose.Schema({
    username: String,
    loginTime: { type: Date, default: Date.now }
});
const UserLog = mongoose.model('UserLog', userSchema);

// E-Sewa Entries को लागि (तपाईंको index.html को फर्म अनुसार)
const esewaSchema = new mongoose.Schema({
    date: String,
    trxCode: String,
    sender: String,
    amount: Number,
    status: String,
    createdAt: { type: Date, default: Date.now }
});
const EsewaEntry = mongoose.model('EsewaEntry', esewaSchema);


// ३. Routes

// मुख्य पेज (index.html) सर्भ गर्ने
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login हुँदा डेटा रेकर्ड गर्ने
app.post('/api/login-log', async (req, res) => {
    try {
        const newLog = new UserLog({ username: req.body.username });
        await newLog.save();
        res.json({ success: true, message: "Login recorded in MongoDB" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// E-Sewa को डेटा MongoDB मा सेभ गर्ने
app.post('/api/save-esewa', async (req, res) => {
    try {
        const newEntry = new EsewaEntry({
            date: req.body.date,
            trxCode: req.body.trx, // HTML को 'trx' field
            sender: req.body.sender,
            amount: req.body.amount,
            status: req.body.status
        });
        await newEntry.save();
        res.json({ success: true, message: "E-Sewa data saved to MongoDB" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// MongoDB बाट सबै E-Sewa रेकर्डहरू तान्ने (यदि चाहियो भने)
app.get('/api/get-esewa', async (req, res) => {
    try {
        const entries = await EsewaEntry.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on: http://localhost:${PORT}`));