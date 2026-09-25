import { validateSite } from "./site-validator.mjs";

const result = await validateSite();

if (result.errors.length > 0) {
    console.error("Static build validation failed:");
    for (const error of result.errors) {
        console.error(`- ${error}`);
    }
    process.exitCode = 1;
} else {
    console.log(`Static build validation passed: ${result.files.length} HTML documents ready for hosting.`);
}
