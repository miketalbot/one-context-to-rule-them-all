export function stringToTitleCaseLabel(inputString) {
    // Split the input string by spaces and camelCase boundaries
    const words = inputString.split(/(?=[A-Z])|\s+/);

    // Capitalize the first letter of each word and join them
    const titleCaseLabel = words
        .map((word) => {
            // Handle acronyms (e.g., "HTTP" or "XML")
            if (word === word.toUpperCase()) {
                return word;
            }

            // Capitalize the first letter of each word
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");

    return titleCaseLabel;
}
