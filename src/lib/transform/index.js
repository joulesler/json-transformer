const requireTransformations = require.context(
    './', // Folder to scan
    false, // Do not scan subdirectories
    /\.js$/ // Match only .js files
);

// Load all transformations from the folder
const loadTransformations = () => {
    const transformations = {};

    // Iterate over each matched module
    requireTransformations.keys().forEach((fileName) => {
        // Skip the index.js file
        if (fileName === './index.js') return;

        // Extract the transformation name without the file extension
        const transformationName = fileName.replace('./', '').replace('.js', '');

        // Import the default export or named exports
        const module = requireTransformations(fileName);

        // Add the transformation to the list (assuming named export matches the file name)
        transformations[transformationName] = module[transformationName];
    });

    return transformations;
};

export default loadTransformations;