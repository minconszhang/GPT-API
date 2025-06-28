export async function getModelList() {
    try {
        const response = await fetch('http://127.0.0.1:3888/api/model-list');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
            models: data.models,
            modelsName: data.modelsName,
        };
    } catch (error) {
        console.error('Failed to fetch model list:', error);
        return {
            models: ["gpt-4o-mini"],
            modelsName: ["4.1 基础版"],
        };
    }
}