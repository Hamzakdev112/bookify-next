import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const nodeModulesPath = path.join(process.cwd(), "node_modules");
const packagePath = path.join(
  process.cwd(),
  "node_modules/@shopify/shopify-api/lib/auth/oauth/oauth.js"
);

if (!fs.existsSync(nodeModulesPath)) {
  console.log("--> `node_modules` folder not found, running `npm install`");
  execSync("npm install");
  console.log("--> Packages installed");
}

fs.readFile(packagePath, "utf8", function (err, data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(/sameSite: 'lax',/g, "sameSite: 'none',");

  fs.writeFile(packagePath, result, "utf8", function (err) {
    if (err) return console.log(err);
    try {
      console.log("--> Installing postinstall and patch-package");
      execSync("npm install --save postinstall-postinstall patch-package");
      console.log("--> Adding patches");
      const packageJsonPath = path.join(process.cwd(), "package.json");
      const packageJsonData = fs.readFileSync(packageJsonPath, "utf-8");
      const packageJson = JSON.parse(packageJsonData);
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.postinstall = "patch-package";
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log("--> Finalizing patches");
      execSync("npx patch-package @shopify/shopify-api");
      console.log(
        "--> Patch complete! You should have a new folder called `patches`, a new script in your `package.json` as `postinstall` and 2 new packages: `postinstall-postinstall` and `patch-package`"
      );
    } catch (error) {
      console.error("Error while installing packages or creating patch", error);
    }
  });
});