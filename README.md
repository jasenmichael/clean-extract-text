## clean-extract-text

### a simple starter for ocr from png/jpg/pdf files - "with receipt text extraction" in mind

#### clean image(or pdf) text, then use tesseract ocr to extract text from cleaned image.

```bash
git clone https://github.com/jasenmichael/clean-extract-text.git
cd clean-extract-text
npm i
npm run start
```

to clean and extract text from your own png, jpg, or pdf
edit the main.js
```javascript
// edit file 
let file = 'src/receipt.pdf'
// and replace 
let file = '<your-file>.pdf|png|jpg'
```

requires imagemagick

note: only tested on linux ubuntu/debian

```bash
sudo apt-get install imagemagick
```


