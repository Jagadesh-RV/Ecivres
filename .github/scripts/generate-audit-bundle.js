const fs = require('fs');

console.log('Generating complete release audit artifacts bundle...');
require('./generate-deployment-report.js');
require('./generate-security-report.js');
require('./generate-performance-report.js');
require('./generate-test-report.js');
require('./generate-rollback-readiness.js');
require('./generate-commit-summary.js');
console.log('Audit artifacts bundle generated successfully.');
