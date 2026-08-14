const fetch = require('node-fetch'); // we'll just use native fetch if available or do a quick http req

async function testAuth() {
  try {
     const res = await fetch('http://localhost:3000/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: 'admin', password: 'admin' })
     });
     const data = await res.json();
     console.log('Login Response:', res.status, data);
     
     if (data.token) {
       const res2 = await fetch('http://localhost:3000/api/students', {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${data.token}`
         },
         body: JSON.stringify({ 
           nameKh: "Test API", 
           gender: "Male" 
         })
       });
       const data2 = await res2.json();
       console.log('Create Student Response:', res2.status, data2);
     }
  } catch (e) {
    console.error(e);
  }
}
testAuth();
