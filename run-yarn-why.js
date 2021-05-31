// @ts-check

const cp = require("child_process");
const path = require("path");

// Yarn 1
{
    cp.execSync(`yarn install`, {
        encoding: "utf8",
        cwd: path.join(__dirname, "./using-yarn1"),
        // stdio: "inherit",
        stdio: "ignore",
    });
    cp.execSync(`yarn why @parcel/fs`, {
        encoding: "utf8",
        cwd: path.join(__dirname, "./using-yarn1"),
        stdio: "inherit",
    });
}

// Yarn 2
{
    cp.execSync(`yarn install`, {
        encoding: "utf8",
        cwd: path.join(__dirname, "./using-yarn2"),
        // stdio: "inherit",
        stdio: "ignore",
    });
    cp.execSync(`yarn why @parcel/fs`, {
        encoding: "utf8",
        cwd: path.join(__dirname, "./using-yarn2"),
        stdio: "inherit",
    });
}
