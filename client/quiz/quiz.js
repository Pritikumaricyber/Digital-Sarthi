document.querySelector(".quiz-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const answers = ["q1", "q2", "q3", "q4", "q5"];
  const spiritCount = { owl: 0, fox: 0, breeze: 0 };

  answers.forEach((q) => {
    const selected = document.querySelector(`input[name="${q}"]:checked`);
    if (selected) {
      spiritCount[selected.value]++;
    }
  });

  // Determine the highest count
  let topSpirit = "owl"; // default
  let maxCount = 0;
  for (let spirit in spiritCount) {
    if (spiritCount[spirit] > maxCount) {
      maxCount = spiritCount[spirit];
      topSpirit = spirit;
    }
  }

  // Update result section
  const result = document.querySelector(".result");
  const spiritCard = result.querySelector(".spirit-card");
  const icon = spiritCard.querySelector(".spirit-icon");
  const title = spiritCard.querySelector(".spirit-title");
  const description = spiritCard.querySelector(".spirit-description");
  const tagline = spiritCard.querySelector(".spirit-tagline");

  if (topSpirit === "owl") {
    icon.textContent = "🦉";
    title.textContent = "Focused Owl";
    description.textContent = "Calm, structured, and driven by progress. You thrive in quiet focus and love the satisfaction of a well-organized plan.";
    tagline.textContent = "“Every tick of the clock is a step toward clarity.”";
  } else if (topSpirit === "fox") {
    icon.textContent = "🦊";
    title.textContent = "Curious Fox";
    description.textContent = "Energetic, spontaneous, and always chasing new ideas. You thrive in bursts of creativity and love playful exploration.";
    tagline.textContent = "“Every spark leads to a new trail.”";
  } else if (topSpirit === "breeze") {
    icon.textContent = "🍃";
    title.textContent = "Gentle Breeze";
    description.textContent = "Reflective, intuitive, and emotionally attuned. You study with heart and value inner clarity over external metrics.";
    tagline.textContent = "“Every breath brings deeper understanding.”";
  }

  result.classList.remove("hidden");
});