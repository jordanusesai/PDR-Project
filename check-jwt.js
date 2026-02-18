require('dotenv').config();
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('JWT_SECRET value:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
