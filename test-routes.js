// Simple test to verify routes are working
const express = require('express');
const groupRoutes = require('./routes/groups');

const app = express();
app.use('/api/groups', groupRoutes);

console.log('Testing group routes...');
console.log('Available routes:');
groupRoutes.stack.forEach(r => {
  if (r.route) {
    console.log(`${Object.keys(r.route.methods)[0].toUpperCase()} /api/groups${r.route.path}`);
  }
});

console.log('\nRoutes should include:');
console.log('PUT /api/groups/:groupId');
console.log('DELETE /api/groups/:groupId');
