function convertDateFormat(dateString) {
  const [day, month, year] = dateString.split('/')
  return `${year}-${month}-${day}`
}

module.exports = {
  convertDateFormat,
}
