import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

function generate() {
    let json = "{"
    for (let i = 1; i <= 12; i++) {
        json += `"${i - 1}":{"id": ${i},"name": "Grade ${i}"},`
    }

    json += `"12":{"id": 13,"name":"Primary School"},`

    json += `"13":{"id":14,"name":"Secondary School"},`

    json += `"14":{"id":15,"name":"High School"}`

    json += "}"

    return json
}

fs.writeFile(path.join(__dirname, "migrations", "grades.json"),
    generate(), { encoding: "utf8" }, (err) => {
        if (err) {
            console.log(err)
        }
    }

)