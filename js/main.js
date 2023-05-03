// Import necessary libraries
// ไม่ต้อง import ใน JavaScript เพราะไม่ได้ใช้ Flask และ PIL ใน JavaScript
const tf = require('@tensorflow/tfjs');
const base64 = require('base64-js');

// Define the image size and channels for the input to the model
// ตั้งค่าขนาดของรูปภาพและจำนวนช่องสีเหมือน Python
const imgWidth = 28;
const imgHeight = 28;
const channels = 1;

// Define the label encoder for one hot decoding
// สร้าง dictionary เหมือน Python
const wordDict = {0: 'A', 1: 'E', 2: 'O', 3: 'U', 4:'Consonant'};

// Load the model
// โหลดโมเดลโดยใช้ TensorFlow.js
// โหลดโมเดล aeou_model.h5 และ aeou_model_conf.h5
let model, modelConf;
async function loadModels() {
    model = await tf.loadLayersModel('aeou_model.h5');
    modelConf = await tf.loadLayersModel('aeou_model_conf.h5');
}
loadModels();

// Get the canvas and context from the HTML
// ใช้ document.querySelector() เพื่อค้นหา canvas จากไอดีและเรียกใช้ getContext() เพื่อรับค่า context ของ canvas
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

// When the user draws on the canvas, get the image data and send it to the server for classification
// ทำเมื่อผู้ใช้วาดภาพบนแคนวาส โดยใช้ addEventListener() เพื่อตรวจจับการคลิกและวาดบนแคนวาส
canvas.addEventListener('mousedown', function(event) {
    canvas.addEventListener('mousemove', onPaint);
}, false);

// When the user stops drawing on the canvas, remove the event listeners and send the image data to the server for classification
// ทำเมื่อผู้ใช้หยุดวาดบนแคนวาส โดยใช้ addEventListener() เพื่อตรวจจับการหยุดคลิกและวาดบนแคนวาส
canvas.addEventListener('mouseup', function(event) {
    canvas.removeEventListener('mousemove', onPaint);
    sendImage();
}, false);

// Define the onPaint function to draw on the canvas
// กำหนดฟังก์ชัน onPaint เพื่อวาดบนแคนวาส
function onPaint(event) {
    // Get the position of the mouse on the canvas
    // รับตำแหน่งของเมาส์บนแคนวา
// Import necessary libraries
// ไม่ต้อง import ใน JavaScript เพราะไม่ได้ใช้ Flask และ PIL ใน JavaScript
const tf = require('@tensorflow/tfjs');
const base64 = require('base64-js');

// Define the image size and channels for the input to the model
// ตั้งค่าขนาดของรูปภาพและจำนวนช่องสีเหมือน Python
const imgWidth = 28;
const imgHeight = 28;
const channels = 1;

// Define the label encoder for one hot decoding
// สร้าง dictionary เหมือน Python
const wordDict = {0: 'A', 1: 'E', 2: 'O', 3: 'U', 4:'Consonant'};

// Load the model
// โหลดโมเดลโดยใช้ TensorFlow.js
// โหลดโมเดล aeou_model.h5 และ aeou_model_conf.h5
let model, modelConf;
async function loadModels() {
    model = await tf.loadLayersModel('aeou_model.h5');
    modelConf = await tf.loadLayersModel('aeou_model_conf.h5');
}
loadModels();

// Get the canvas and context from the HTML
// ใช้ document.querySelector() เพื่อค้นหา canvas จากไอดีและเรียกใช้ getContext() เพื่อรับค่า context ของ canvas
const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');

// When the user draws on the canvas, get the image data and send it to the server for classification
// ทำเมื่อผู้ใช้วาดภาพบนแคนวาส โดยใช้ addEventListener() เพื่อตรวจจับการคลิกและวาดบนแคนวาส
canvas.addEventListener('mousedown', function(event) {
    canvas.addEventListener('mousemove', onPaint);
}, false);

// When the user stops drawing on the canvas, remove the event listeners and send the image data to the server for classification
// ทำเมื่อผู้ใช้หยุดวาดบนแคนวาส โดยใช้ addEventListener() เพื่อตรวจจับการหยุดคลิกและวาดบนแคนวาส
canvas.addEventListener('mouseup', function(event) {
    canvas.removeEventListener('mousemove', onPaint);
    sendImage();
}, false);

// Define the onPaint function to draw on the canvas
// กำหนดฟังก์ชัน onPaint เพื่อวาดบนแคนวาส
function onPaint(event) {
    // Get the position of the mouse on the canvas
    // รับตำแหน่งของเมาส์บนแคนวา

ChatGPT
// ใช้ event.offsetX และ event.offsetY เพื่อรับตำแหน่งของเมาส์บนแคนวาส
const x = event.offsetX;
const y = event.offsetY;

// Draw a small circle on the canvas at the mouse position
// วาดวงกลมเล็กบนแคนวาสที่ตำแหน่งของเมาส์
context.fillStyle = '#000000';
context.beginPath();
context.arc(x, y, 5, 0, 2 * Math.PI);
context.fill();
}

// Define the sendImage function to send the image data to the server for classification
// กำหนดฟังก์ชัน sendImage เพื่อส่งข้อมูลรูปภาพไปยังเซิร์ฟเวอร์เพื่อจัดประเภท
async function sendImage() {
// Get the base64 encoding of the image data from the canvas
// รับการเข้ารหัส base64 ของข้อมูลภาพจากแคนวาส
const imageData = context.getImageData(0, 0, imgWidth, imgHeight);
const data = imageData.data;
let input = new Float32Array(imgWidth * imgHeight);
for (let i = 0; i < data.length; i += 4) {
const r = data[i];
const g = data[i + 1];
const b = data[i + 2];
const gray = (r + g + b) / 3.0 / 255.0;
const index = Math.floor(i / 4);
input[index] = gray;
}
const imageTensor = tf.tensor4d(input, [1, imgWidth, imgHeight, channels]);

// Use the model to predict the character and confidence level
// ใช้โมเดลเพื่อทำนายตัวอักษรและระดับความมั่นใจ
const prediction = model.predict(imageTensor);
const conf = modelConf.predict(imageTensor);

// Decode the one hot encoding of the prediction to get the character
// ถอดรหัสแบบ one hot ของการทำนายเพื่อรับตัวอักษร
const maxIndex = prediction.argMax(1).dataSync()[0];
const character = wordDict[maxIndex];

// Get the confidence level from the model output
// รับระดับความมั่นใจจากผลลัพธ์ของโมเดล
const confidence = conf.max().dataSync()[0];

// Display the character and confidence level to the user
// แสดงตัวอักษรและระดับความมั่นใจให้ผู้ใช้เห็น
const resultDiv = document.querySelector('#result');
resultDiv.innerHTML = `Prediction: ${character} (Confidence: ${Math.round(confidence * 100)}%)`;

}
}