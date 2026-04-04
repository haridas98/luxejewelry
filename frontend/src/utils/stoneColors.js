// Цвета для камней (будут загружены из API)
export const STONE_COLORS = {};

// Загрузка камней из API
export const fetchStones = async () => {
    try {
        const response = await fetch('apiEndpoint(ENDPOINTS.stones/');
        const data = await response.json();
        
        // Сохраняем цвета
        data.forEach(stone => {
            STONE_COLORS[stone.name] = stone.color || '#94a3b8';
        });
        
        return data;
    } catch (error) {
        console.error('Error fetching stones:', error);
        return [];
    }
};

// Получить список камней из продуктов
export const getAvailableStones = (products) => {
    const stoneMap = new Map();
    
    products.forEach(p => {
        if (p.stones && p.stones.length > 0) {
            p.stones.forEach(stone => {
                if (!stoneMap.has(stone.id)) {
                    stoneMap.set(stone.id, {
                        id: stone.id,
                        name: stone.name,
                        color: stone.color || '#94a3b8',
                        count: 0
                    });
                }
                stoneMap.get(stone.id).count++;
            });
        }
    });
    
    return Array.from(stoneMap.values());
};
