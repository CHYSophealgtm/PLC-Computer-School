async function testAuth() {
  try {
     const res2 = await fetch('http://localhost:3000/api/students', {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer demo_auth_token_bypass`
         },
         body: JSON.stringify({ 
           nameKh: "Test API Demo", 
           gender: "Male" 
         })
       });
       const text2 = await res2.text();
       console.log('Create Student Response Status (Demo):', res2.status);
       console.log('Create Student Response Body (Demo):', text2);
  } catch (e) {
    console.error(e);
  }
}
testAuth();
