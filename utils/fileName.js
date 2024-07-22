const fs = require('fs');
const path = require('path');

// Function to recursively list all files in a directory
function listAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            listAllFiles(filePath, fileList);
        } else {
            fileList.push(filePath);
        }
    });
    return fileList;
}

// Function to get the file extension
function getFileExtension(filename) {
    return filename.split('.').pop();
}

// Path to the folder containing images
const imagesFolder = '../images';

// List all image files in the folder and its subfolders (recursively)
const imageFiles = listAllFiles(imagesFolder).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

// Create CSV report
const csvReport = imageFiles.map(file => {
    const fileName = path.basename(file);
    const fileExtension = getFileExtension(fileName);
    const subfolderName = path.relative(imagesFolder, path.dirname(file));
    const fullPath = path.resolve(file);
    return `${fullPath},${fileName},${subfolderName},${fileExtension}`;
}).join('\n');

// Write CSV report to a file
fs.writeFileSync('image_report.csv', `image full path,image name,subfolder name,image format type\n${csvReport}`);

console.log('CSV report created successfully.');
