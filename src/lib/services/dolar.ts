export const getBCVRate = async (): Promise<number | null> => {
    try {
        const response = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
        const data = await response.json();
        return data.promedio || null;
    } catch (error) {
        console.error("Error fetching BCV rate:", error);
        return null;
    }
};
