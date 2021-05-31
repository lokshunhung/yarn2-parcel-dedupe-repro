// @ts-check

const cp = require("child_process");
const path = require("path");

// Yarn 1
{
    console.log(`
========================================
[yarn 1] installing node_modules
========================================
`);
    cp.execSync(`yarn install`, {
        encoding: "utf8",
        cwd: path.join(__dirname, "./using-yarn1"),
        // stdio: "inherit",
        stdio: "ignore",
    });
    console.log(`
========================================
[yarn 1] running "$ yarn why @parcel/fs"
========================================
`);
    cp.execSync(`yarn why @parcel/fs`, {
        encoding: "utf8",
        cwd: path.join(__dirname, "./using-yarn1"),
        stdio: "inherit",
    });
    console.log(`
========================================
[yarn 1] script completed
========================================
`);
}

// Yarn 2
{
    console.log(`
========================================
[yarn 2] installing node_modules
========================================
`);
    cp.execSync(`yarn install`, {
        encoding: "utf8",
        cwd: path.join(__dirname, "./using-yarn2"),
        // stdio: "inherit",
        stdio: "ignore",
    });
    console.log(`
========================================
[yarn 2] running "$ yarn why @parcel/fs"
========================================
`);
    cp.execSync(`yarn why @parcel/fs`, {
        encoding: "utf8",
        cwd: path.join(__dirname, "./using-yarn2"),
        stdio: "inherit",
    });
    console.log(`
========================================
[yarn 2] script completed
========================================
`);
}
