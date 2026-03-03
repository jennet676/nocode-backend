import * as db from '../db.js';

/**
 * Maglumat bazasyndan maglumatlary almak üçin kömekçi funksiýa.
 * (Helper function to execute database queries with error handling.)
 * 
 * @param {string} text - SQL sorgusy (SQL query text)
 * @param {Array} params - Sorgu parametrleri (Query parameters)
 * @returns {Promise<Object>} - Sorgu netijesi (Query result)
 */
export const executeQuery = async (text, params) => {
    try {
        const result = await db.query(text, params);
        return { data: result.rows, error: null };
    } catch (err) {
        console.error('Maglumat bazasynda ýalňyşlyk ýüze çykdy:', err.message);
        return { data: null, error: err.message };
    }
};

/**
 * Ýekeje setiri almak üçin kömekçi funksiýa.
 * (Helper function to execute a query and return a single row.)
 */
export const executeSingleQuery = async (text, params) => {
    const { data, error } = await executeQuery(text, params);
    if (error) return { data: null, error };
    return { data: data[0] || null, error: null };
};
