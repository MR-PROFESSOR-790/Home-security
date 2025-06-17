const { exec } = require("child_process")

console.log("Running seed script...")

exec("node scripts/seed.js", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`)
    return
  }
  console.log(stdout)
})
