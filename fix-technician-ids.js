// Quick fix to remove all ID fields from add-more-technicians.js
const fs = require('fs');

// Read the file
let content = fs.readFileSync('add-more-technicians.js', 'utf8');

// Remove all id lines that look like: id: 'tech_anything',
content = content.replace(/\s+id:\s*['"`][^'"`]*['"`],?\n/g, '\n');

// Write back the file
fs.writeFileSync('add-more-technicians.js', content);

console.log('✅ Removed all custom ID fields from add-more-technicians.js');
console.log('📝 Supabase will now auto-generate UUIDs for new technicians');