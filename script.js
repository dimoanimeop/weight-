// Healthy Weight Calculator
// No external libraries required.

const form = document.getElementById("weightForm");

const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");

const errorMessage = document.getElementById("errorMessage");
const results = document.getElementById("results");

const adultResults = document.getElementById("adultResults");
const youngResults = document.getElementById("youngResults");

const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");

const minWeight = document.getElementById("minWeight");
const maxWeight = document.getElementById("maxWeight");

const comparisonText = document.getElementById("comparisonText");
const youngMessage = document.getElementById("youngMessage");

// Read a number only if the input is not empty and is finite.
function readNumber(input) {
  const rawValue = input.value.trim();

  if (rawValue === "") {
    return null;
  }

  const value = Number(rawValue);

  return Number.isFinite(value) ? value : null;
}

// Display an input error.
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  results.hidden = true;
}

// Clear the current error.
function clearError() {
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

// Find the selected gender.
function getSelectedGender() {
  const selected = document.querySelector(
    'input[name="gender"]:checked'
  );

  return selected ? selected.value : null;
}

// Validate all inputs.
function validateInputs() {
  const age = readNumber(ageInput);
  const height = readNumber(heightInput);
  const weight = readNumber(weightInput);

  if (age === null || height === null || weight === null) {
    showError("Please fill in all fields with valid numbers.");
    return null;
  }

  if (!Number.isInteger(age) || age < 2 || age > 120) {
    showError("Please enter an age between 2 and 120 years.");
    return null;
  }

  if (height < 50 || height > 250) {
    showError("Please enter a height between 50 and 250 cm.");
    return null;
  }

  if (weight < 2 || weight > 500) {
    showError("Please enter a weight between 2 and 500 kg.");
    return null;
  }

  const gender = getSelectedGender();

  if (!gender) {
    showError("Please select Male or Female.");
    return null;
  }

  return { age, height, weight, gender };
}

// Classify adult BMI according to standard adult categories.
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return "Below the adult reference range";
  }

  if (bmi < 25) {
    return "Within the adult reference range";
  }

  if (bmi < 30) {
    return "Above the adult reference range";
  }

  return "High adult BMI range";
}

// Format a number for display.
function formatNumber(number) {
  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
}

// Display the adult calculation.
function showAdultResults(height, weight) {
  const heightInMetres = height / 100;
  const heightSquared = heightInMetres ** 2;

  // Adult BMI = weight in kg / height in metres squared.
  const bmi = weight / heightSquared;

  // Estimated adult healthy weight range using BMI 18.5–24.9.
  const lowerLimit = 18.5 * heightSquared;
  const upperLimit = 24.9 * heightSquared;

  bmiValue.textContent = bmi.toFixed(1);
  bmiCategory.textContent = getBMICategory(bmi);

  minWeight.textContent = formatNumber(lowerLimit);
  maxWeight.textContent = formatNumber(upperLimit);

  // Compare current weight with the estimated range.
  if (weight < lowerLimit) {
    const difference = lowerLimit - weight;

    comparisonText.textContent =
      `Your current weight is ${formatNumber(difference)} kg ` +
      "below the estimated range. This is only a screening estimate.";
  } else if (weight > upperLimit) {
    const difference = weight - upperLimit;

    comparisonText.textContent =
      `Your current weight is ${formatNumber(difference)} kg ` +
      "above the estimated range. This is only a screening estimate.";
  } else {
    comparisonText.textContent =
      "Your current weight falls within the estimated adult " +
      "BMI-based range. This does not guarantee overall health.";
  }

  adultResults.hidden = false;
  youngResults.hidden = true;
}

// Do not apply adult BMI categories to children or teenagers.
function showYoungResults(age) {
  youngMessage.textContent =
    `At age ${age}, adult BMI categories and adult healthy-weight ` +
    "ranges should not be used. Children and teenagers need an " +
    "age- and sex-specific BMI-for-age growth chart. Please consult " +
    "a qualified healthcare professional for an appropriate assessment.";

  adultResults.hidden = true;
  youngResults.hidden = false;
}

// Handle form submission.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  clearError();

  const data = validateInputs();

  if (!data) {
    return;
  }

  results.hidden = false;

  if (data.age < 20) {
    showYoungResults(data.age);
  } else {
    showAdultResults(data.height, data.weight);
  }

  // Bring the result card into view on mobile.
  results.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});

// Handle Reset.
form.addEventListener("reset", function () {
  clearError();
  results.hidden = true;

  adultResults.hidden = true;
  youngResults.hidden = true;

  // Clear any previously displayed results.
  bmiValue.textContent = "--";
  bmiCategory.textContent = "";
  minWeight.textContent = "--";
  maxWeight.textContent = "--";
  comparisonText.textContent = "";
  youngMessage.textContent = "";
});

// Clear stale errors as the user edits the inputs.
[ageInput, heightInput, weightInput].forEach(function (input) {
  input.addEventListener("input", function () {
    clearError();
  });
});
