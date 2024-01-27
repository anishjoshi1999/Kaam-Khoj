function toTitleCase(inputString) {
  if (!inputString) return ""; // Add this line to handle null or undefined values

  const words = inputString.toLowerCase().split(" ");
  const titleCaseWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return titleCaseWords.join(" ");
}

function checkForSalary(value) {
  let salary = Number(value);
  if (!isNaN(salary) && salary !== undefined) {
    if (salary <= 5000) {
      return "Negotiable";
    } else {
      return value;
    }
  } else {
    return value;
  }
}

module.exports = { toTitleCase, checkForSalary };
