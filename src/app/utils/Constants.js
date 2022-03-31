//const ROOT = 'https://koimedia-backend.herokuapp.com/api/'
const ROOT = 'http://localhost:3003/api/'
//const ROOT = 'http://77.243.85.149:3003/api/'
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
    AUTH : ROOT + 'login',
    NOTIFICATION : ROOT + 'notification'
}

export default {
    APIRoot : ROOT,
    APIEndpoints : ENDPOINTS
}