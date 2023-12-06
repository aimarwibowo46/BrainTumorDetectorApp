export const envService = {
    envUrl,
}

function envUrl() {
    // ubah value env 1 untuk (production) dan 2 untuk (Local/dev mode)
    var env = 1;
    var url = ''
    if (env == 1) {
        return url = 'http://103.180.124.154:5280/'
    } else {
        return url = 'http://localhost:8000/api'
    }

}