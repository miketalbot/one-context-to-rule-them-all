
export function isReactEvent(value) {
    return (
        typeof value === "object" && // Check if it's an object
        "target" in value && // Check for the 'target' property
        "type" in value && // Check for the 'type' property
        typeof value.preventDefault === "function" // Check for the 'preventDefault' method
    );
}
