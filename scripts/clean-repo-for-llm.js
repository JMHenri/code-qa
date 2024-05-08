const fs = require('fs');
const path = require('path');

// Directory containing the downloaded repository
const repoDir = path.join(__dirname, '../downloaded-repo');

// Array of file extensions to remove
const fileExtensionsToRemove = [
  // Image file extensions
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg',
  // Sound file extensions
  '.mp3', '.wav', '.aac', '.ogg', '.flac', '.wma',
];

// Maximum file size in bytes (20 kilobytes)
const maxFileSizeBytes = 20 * 1024;

function removeFiles(directory) {
  // Read the contents of the directory
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If the file is a directory, recursively traverse it
      removeFiles(filePath);
    } else {
      const fileExtension = path.extname(file).toLowerCase();
      const fileSize = stat.size;

      if (fileExtensionsToRemove.includes(fileExtension) || fileSize > maxFileSizeBytes) {
        // If the file has an extension to remove or exceeds the maximum size, delete it
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    }
  });
}

removeFiles(repoDir);
console.log('Image files, sound files, and files larger than 10 kilobytes removed successfully!');