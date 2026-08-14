async function testAuth() {
  try {
     const res2 = await fetch('http://localhost:3000/api/students', {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           // no authorization
         },
         body: JSON.stringify({ 
           nameKh: "Test API Demo", 
           gender: "Male" 
         })
       });
       const text2 = await res2.text();
       console.log('Create Student Response Status (No auth):', res2.status);
       console.log('Create Student Response Body (No auth):', text2);
  } catch (e) {
    console.error(e);
  }
}
testAuth();
