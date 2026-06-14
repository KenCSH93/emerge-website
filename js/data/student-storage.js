function getStudents() {
  const savedStudents = localStorage.getItem("students");

  if (savedStudents) {
    return JSON.parse(savedStudents);
  }

  localStorage.setItem("students", JSON.stringify(students));
  return students;
}

function saveStudents(updatedStudents) {
  localStorage.setItem("students", JSON.stringify(updatedStudents));
}