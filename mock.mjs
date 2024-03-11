import fs from "fs";
import path from "path";

const __dirname = import.meta.dirname;

function generate() {
    let json = "{"
    let tempArr = []
    for (let i = 1; i <= 4; i++) {
        tempArr.push(`"${i - 1}":{"id":${i},"username":"test00${i}","role":"00${i}","password":""}`)
    }

    json += tempArr.join(",")

    json += "}"

    return json.trim()
}

fs.writeFile(path.join(__dirname, "migrations", "users.json"),
    generate(), { encoding: "utf8" }, (err) => {
        if (err) {
            console.log(err)
        }
    }

)