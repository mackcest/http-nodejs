const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json());

// const mongoUrl = 'mongodb://localhost:27017';
const mongoUrl = 'mongodb+srv://doquangminhhaik:CY1bIwG2h1ShrdW5@cluster0.akcujdl.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'url_shortener';
const collectionName = 'urls';
const cors = require('cors');

const corsOptions = {
    origin: 'https://mackcest.github.io',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
// Tạo một chuỗi ngẫu nhiên với độ dài là length
function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Kết nối đến MongoDB và trả về một kết nối đến cơ sở dữ liệu
async function connectToDatabase() {
    const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
    const db = client.db(dbName);
    return db;
}

// Tạo một endpoint API để tạo liên kết ngắn mới
app.post('/api/shorten', async (req, res) => {
    const url = req.body.url;
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);

    // Tìm kiếm liên kết ngắn trong cơ sở dữ liệu
    const result = await collection.findOne({ url });

    if (result) {
        // Nếu liên kết đã tồn tại trong cơ sở dữ liệu, trả về liên kết ngắn hiện có
        res.json({ shortUrl: result.shortUrl });
    } else {
        // Nếu liên kết chưa tồn tại, tạo một liên kết ngắn mới và lưu vào cơ sở dữ liệu
        const shortUrl = generateRandomString(6);
        await collection.insertOne({ url, shortUrl });
        res.json({ shortUrl });
    }
});

// Tạo một endpoint API để chuyển hướng từ liên kết ngắn đến liên kết gốc
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = req.params.shortUrl;
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);

    // Tìm kiếm liên kết gốc trong cơ sở dữ liệu
    const result = await collection.findOne({ shortUrl });

    if (result) {
        // Nếu liên kết được tìm thấy, chuyển hướng đến liên kết gốc
        res.redirect(result.url);
    } else {
        // Nếu liên kết không tồn tại, trả về mã lỗi 404
        res.sendStatus(404);
    }
});

// Khởi động máy chủ
app.listen(3001, () => {
    console.log('Server started on port 3001');
});

