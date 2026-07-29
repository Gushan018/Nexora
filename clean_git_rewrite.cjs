const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '.git-rewrite');
if (fs.existsSync(target)) {
  try {
    fs.rmSync(target, { recursive: true, force: true });
    console.log('Successfully cleaned .git-rewrite folder.');
  } catch (e) {
    console.error('Error removing .git-rewrite:', e.message);
  }
} else {
  console.log('.git-rewrite folder does not exist.');
}
