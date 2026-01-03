import db from '../db/knex.js';

export const getStocks = async () => {
    return await db('stocks').select('*');
};

export const getStockBySymbol = async (symbol) => {
    return await db('stocks').where({ symbol }).first();
}

export const addStock = async (stock) => {
    const existingStock = await getStockBySymbol(stock.symbol);
    if (existingStock) {
        throw new Error('Stock with this symbol already exists');
    }
    const [newStock] = await db('stocks').insert(stock).returning('*');
    return newStock;
}

export const deleteStockBySymbol = async (symbol) => {
    const deletedCount = await db('stocks')
        .where({ symbol })
        .del();

    if (deletedCount === 0) {
        throw new Error('Stock not found');
    }

    return deletedCount;
};


export const updateStockPrice = async (symbol, price) => {
    const updateData = {
        price,
        updated_at: db.fn.now()
    };

    const [stock] = await db('stocks')
        .where({ symbol })
        .update(updateData)
        .returning('*');

    if (!stock) {
        throw new Error('Stock not found');
    }

    return stock;
};

export const getStocksByPriceRange = async (minPrice, maxPrice) => {
    return await db('stocks').whereBetween('price', [minPrice, maxPrice]);
}

