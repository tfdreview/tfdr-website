<script>
  document.getElementById("leadForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/send-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Thank you. Your message has been sent.");
        e.target.reset();
      } else {
        alert("Form error: " + JSON.stringify(result));
      }
    } catch (error) {
      alert("Browser error: " + error.message);
    }
  });
</script>
