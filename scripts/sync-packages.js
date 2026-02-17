import { execSync } from 'child_process';
import { unlinkSync, existsSync } from 'fs';

// Remove the out-of-sync lock file
if (existsSync('package-lock.json')) {
  unlinkSync('package-lock.json');
  console.log('Removed out-of-sync package-lock.json');
}

// Regenerate the lock file by installing dependencies
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('Successfully regenerated package-lock.json');
} catch (error) {
  console.error('Error running npm install:', error);
  process.exit(1);
}
