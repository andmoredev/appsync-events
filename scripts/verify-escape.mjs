import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// File paths
const handlerFilePath = join(process.cwd(), 'src/backend/appsync-handlers/event-api.mjs');
const templateFilePath = join(process.cwd(), 'infrastructure/template.yaml');
const outputFilePath = join(process.cwd(), 'infrastructure/template-updated.yaml');

// Read the handler file
const handlerCode = readFileSync(handlerFilePath, 'utf8');

// Escape the code while preserving meaningful spaces
const escapedCode = handlerCode
  .replace(/\n/g, '\\n') // Replace newlines with \n
  .replace(/"/g, '\\"') // Escape double quotes
  .replace(/\s{2,}/g, ' '); // Replace multiple spaces with a single space

// Read the template file
let templateContent = readFileSync(templateFilePath, 'utf8');

// Replace the placeholder with the escaped code
templateContent = templateContent.replace('{{StringCodeHandler}}', escapedCode);

// Write the updated template to a new file
writeFileSync(outputFilePath, templateContent, 'utf8');

console.log('Template updated successfully!');
console.log(`Updated template saved to: ${outputFilePath}`);