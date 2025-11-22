const fs = require('fs');
const path = require('path');

console.log('='.repeat(50));
console.log('LIS Journal - Configuration Check');
console.log('='.repeat(50));
console.log('');

// Check server .env file
const serverEnvPath = path.join(__dirname, 'server', '.env');
console.log('[1] Checking server/.env file...');

if (fs.existsSync(serverEnvPath)) {
    console.log('    ✓ File exists');
    
    const envContent = fs.readFileSync(serverEnvPath, 'utf8');
    const lines = envContent.split('\n');
    
    let hasDbUrl = false;
    let hasApiKey = false;
    let hasPort = false;
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('DATABASE_URL=') && !trimmed.includes('your_') && trimmed.split('=')[1]) {
            hasDbUrl = true;
        }
        if (trimmed.startsWith('GEMINI_API_KEY=') && !trimmed.includes('your_') && trimmed.split('=')[1]) {
            hasApiKey = true;
        }
        if (trimmed.startsWith('PORT=')) {
            hasPort = true;
        }
    });
    
    console.log('');
    console.log('    Environment Variables:');
    console.log(`    DATABASE_URL: ${hasDbUrl ? '✓ Configured' : '✗ Missing or not set'}`);
    console.log(`    GEMINI_API_KEY: ${hasApiKey ? '✓ Configured' : '✗ Missing or not set'}`);
    console.log(`    PORT: ${hasPort ? '✓ Configured' : '⚠ Using default (3001)'}`);
    
    console.log('');
    if (!hasDbUrl || !hasApiKey) {
        console.log('    ⚠ WARNING: Required environment variables are missing!');
        console.log('');
        console.log('    Please edit server/.env and add:');
        if (!hasDbUrl) {
            console.log('    - DATABASE_URL=postgresql://username:password@localhost:5432/lis_journal');
        }
        if (!hasApiKey) {
            console.log('    - GEMINI_API_KEY=your_actual_api_key');
            console.log('      Get your key from: https://aistudio.google.com/app/apikey');
        }
    } else {
        console.log('    ✓ All required variables are configured');
    }
} else {
    console.log('    ✗ File not found!');
    console.log('    Please copy server/.env.example to server/.env');
}

console.log('');
console.log('[2] Checking frontend .env file...');
const frontendEnvPath = path.join(__dirname, '.env');

if (fs.existsSync(frontendEnvPath)) {
    const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
    const apiUrlMatch = envContent.match(/VITE_API_URL=(.+)/);
    
    if (apiUrlMatch) {
        const apiUrl = apiUrlMatch[1].trim();
        console.log(`    ✓ API URL: ${apiUrl}`);
        
        if (apiUrl.includes(':3001')) {
            console.log('    ✓ Port matches server default (3001)');
        } else {
            console.log('    ⚠ Port mismatch! Server uses 3001 by default');
        }
    }
} else {
    console.log('    ✗ File not found!');
}

console.log('');
console.log('='.repeat(50));
console.log('');
console.log('Next Steps:');
console.log('1. Fix any issues shown above');
console.log('2. Start backend: cd server && npm run dev');
console.log('3. Start frontend: npm run dev');
console.log('4. Test publishing from admin panel');
console.log('');
