const PROD_API_URL = 'https://elite-construction-api-server.pxxlspace.cv';

export const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || PROD_API_URL);
