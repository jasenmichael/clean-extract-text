let file = 'src/receipt.pdf'
// const file = 'src/receipt.jpg'


let Tesseract = require('tesseract.js')
const fs = require('fs')
const exec = require('child_process').exec
const shell = require('shelljs')
const imageDataURI = require('image-data-uri')
const { TesseractWorker } = Tesseract
const worker = new TesseractWorker()

const outImage = 'extracted/cleanedUp.png'

const isPdf = (file.substr(-3) === ('pdf' || 'PDF'))
console.log(isPdf)

if (isPdf) {
  // const convertPdfCommand = `convert -density 300 -define profile:skip=ICC ${file} jpg:- | cat - | base64`
  const convertPdfCommand = `convert -density 300 -define profile:skip=ICC ${file} extracted/converted.jpg`
  file = 'extracted/converted.jpg'
  dataFile = shell.exec(convertPdfCommand, {silent:true}).stdout
  // file = "data:image/jpg;base64," + dataFile
  // imageDataURI.encodeFromFile(dataFile).then(data => {
    //   file = data
    //   // return data
    //   cleanup
    //   console.log(data)
    // }).catch(err => {return err})
  }
  
// const cleanupCommand = `./scripts/textcleaner.sh -g -e normalize -f 30 -o 12 -s 2 ${myImage} tmp/cleanedUp.png && echo tmp/cleanedUp.png`
const cleanupCommand = `./scripts/cleanimagetext.sh ${file} ${outImage} && echo ${outImage}`
exec(cleanupCommand).stdout.on('data', function (data) {
  let image = data.trim()
  console.log('image', image)
  let status = ''
  let progress = 0

  imageDataURI.encodeFromFile(image)
    .then(image => {
      // console.log('dataUrl', image)
      worker
        .recognize(image)
        .progress((p) => {
          if (p.status === 'recognizing text' && p.progress !== progress) {
            progress = p.progress
            console.log(p.status + ' -', Math.round(p.progress * 100) + "% complete")
            status = p.status
          }
          if (p.status != status) {
            console.log(p.status)
            status = p.status
          } else {
            status = p.status
          }
        })
        .then(({
          text
        }) => {
          console.log(text);
          fs.writeFile('extracted/data.txt', text, err => {
            if (err) throw err
          })
          let json = {
            text: text.split('\n').filter(v => v != '')
          }
          fs.writeFile('extracted/data.json', JSON.stringify(json, null, 2), err => {
            if (err) throw err
          })
          worker.terminate();
          // bash('rm tmp/cleanedUp.jpg')
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(() => {})
})
// })