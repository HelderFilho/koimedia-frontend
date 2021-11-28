const ROOT = 'http://https://koimedia-backend.herokuapp.com/api/'
const ENDPOINTS = {
    USER : ROOT + 'user',
    VEHICLE : ROOT + 'vehicle',
    CLIENT : ROOT + 'client',
    AGENCY : ROOT + 'agency',
    MAILING :ROOT + 'mailing',
    PRODUCT : ROOT + 'product',
    SQUARE : ROOT + 'square',
    STATUS : ROOT + 'status',
    PROPOSAL : ROOT + 'proposal',
    AUTH : ROOT + 'login'
}

export default {
    APIRoot : ROOT,
    APIEndpoints : ENDPOINTS
}