const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];
const modulePath = process.argv[3];

if (!moduleName || !modulePath) {
  console.error('Usage: node register-module.js <ModuleName> <RelativePathFromAppModule>');
  process.exit(1);
}

const appModulePath = path.join(__dirname, '../apps/api/src/app.module.ts');
let code = fs.readFileSync(appModulePath, 'utf8');

if (code.includes(moduleName)) {
  console.log(`${moduleName} is already in app.module.ts`);
  process.exit(0);
}

const importLine = `import { ${moduleName} } from '${modulePath}';\n`;
code = importLine + code;

code = code.replace(/imports:\s*\[/, `imports: [\n    ${moduleName},`);

fs.writeFileSync(appModulePath, code, 'utf8');
console.log(`Successfully registered ${moduleName} in app.module.ts`);
