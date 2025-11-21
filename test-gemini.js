// test-gemini.js
const apiKey = "AIzaSyB-D_8raRWfl5wT3umq4ZUDuvCtWOk_ULM"; // Replace with your new key

fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error("❌ Error:", data.error.message);
    } else {
      console.log("✅ Success! Available models:");
      data.models.forEach(model => {
        console.log(`  - ${model.name}`);
      });
    }
  })
  .catch(err => console.error("❌ Network error:", err));