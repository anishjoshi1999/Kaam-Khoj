function toTitleCase(inputString) {
  if (!inputString) return "";

  const words = inputString.toLowerCase().split(" ");
  const titleCaseWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return titleCaseWords.join(" ");
}

function checkForSalary(value) {
  const salary = Number(value);

  if (!isNaN(salary) && salary > 5000) {
    return value;
  } else {
    return "Negotiable";
  }
}

module.exports = { toTitleCase, checkForSalary };
