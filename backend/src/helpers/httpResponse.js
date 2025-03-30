export const ok = (body) => {
    return {
        success: true,
        statusCode: 200,
        body
    }
}

export const notFound = () => {
    return {
        success: false,
        statusCode: 404,
        body: 'Não encontrado'
    }
}

export const serveError = (error) => {
    return {
        success: false,
        statusCode: 500,
        body: error
    }
}


