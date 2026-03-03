/**
 * Standart jogap formaty üçin kömekçi funksiýalar.
 * (Standardized response formatting helpers with Turkmen comments.)
 */

/**
 * Şowly netije jogaby (Success response)
 */
export const sendSuccess = (res, data, message = 'Amal şowly tamamlandy', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Ýalňyşlyk jogaby (Error response)
 */
export const sendError = (res, message = 'Ýalňyşlyk ýüze çykdy', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error
    });
};

/**
 * Tapylmady jogaby (Not Found response)
 */
export const sendNotFound = (res, message = 'Maglumat tapylmady') => {
    return sendError(res, message, 404);
};

/**
 * Rugsat berilmedi jogaby (Unauthorized response)
 */
export const sendUnauthorized = (res, message = 'Ulgama girmegiňiz gadagan') => {
    return sendError(res, message, 401);
};

/**
 * Nädogry maglumat jogaby (Bad Request response)
 */
export const sendBadRequest = (res, message = 'Maglumatlar nädogry') => {
    return sendError(res, message, 400);
};
