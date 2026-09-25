import { validateSite } from "./site-validator.mjs";

const result = await validateSite();

if (result.errors.length > 0) {
    console.error("Site lint failed:");
    for (const error of result.errors) {
        console.error(`- ${error}`);
    }
    process.exitCode = 1;
} else {
    console.log(`Site lint passed: ${result.files.length} HTML documents checked.`);
}
