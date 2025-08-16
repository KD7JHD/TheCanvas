import fs from 'fs';

const modalFiles = [
  'src/shared/components/BlockPropertiesModal.tsx',
  'src/shared/components/CreateProjectModal.tsx',
  'src/shared/components/DeleteProjectModal.tsx',
  'src/shared/components/EditProjectModal.tsx',
  'src/shared/components/ProjectDetailsModal.tsx'
];

function fixModalFile(filePath) {
  console.log(`Fixing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // The issue is that we have a content div that's missing its closing tag
  // We need to add a closing div before the buttons div
  const pattern = /(\s*)<\/div>\n(\s*)<\/div>\n(\s*)<div className="flex gap-3 pt-4/;
  
  if (pattern.test(content)) {
    // Add the missing closing div for the content section
    content = content.replace(pattern, '$1</div>\n$2</div>\n$3<div className="flex gap-3 pt-4');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Fixed ${filePath}`);
  } else {
    console.log(`  No pattern found in ${filePath}`);
  }
}

// Fix all modal files
modalFiles.forEach(fixModalFile);
console.log('Modal fixes completed!');
