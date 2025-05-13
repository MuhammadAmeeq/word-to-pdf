const express = require('express');
const app = express();
const libre = require('libreoffice-convert');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Word to PDF Converter</title>
        </head>
        <body>
            <h1>Word to PDF Converter</h1>
            <form action="/convert" method="post" enctype="multipart/form-data">
                <label for="file">Upload a Word file:</label>
                <input type="file" id="file" name="file" required>
                <button type="submit">Convert to PDF</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/convert', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const outputPath = `${filePath}.pdf`;

    const docxBuf = fs.readFileSync(filePath);

    libre.convert(docxBuf, '.pdf', undefined, (err, done) => {
        if (err) {
            console.error(`Conversion error: ${err}`);
            return res.status(500).send('Conversion failed.');
        }

        fs.writeFileSync(outputPath, done);
        res.download(outputPath, 'converted.pdf', () => {
            fs.unlinkSync(filePath);      // delete original
            fs.unlinkSync(outputPath);    // delete converted
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});