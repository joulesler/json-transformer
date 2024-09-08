export const normalizeCurrency = (dollarValue) => {
    if (!parseFloat(dollarValue)) {
        return "0";
    }
    if (dollarValue === null || dollarValue === undefined) {
        return "0";
    }
    return String(parseFloat(dollarValue.replace(/[^0-9.-]+/g, '')));
};