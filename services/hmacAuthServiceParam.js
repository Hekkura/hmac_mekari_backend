const crypto = require('crypto')

class HmacAuthServiceParam { 
    //Generate Base-64 encoded SHA-256 body of request
    static generateBodyDigestParam(bodyString) {
        return crypto
                .createHash('sha256')
                .update(bodyString)
                .digest('base64')
    }
    //Generate HMAC-SHA256 Signature
    static generateHmacSignatureParam(stringToSign, clientSecret) { 
        return crypto
                .createHmac('sha256', clientSecret)
                .update(stringToSign, 'utf8')
                .digest('base64')
    }

    //======== Generate Headers ======== // 
    static generateHeadersParam(config, clientKey, clientSecret) { 
        if(!config.apiEndpoint || !config.apiMethod) { 
            throw new Error('apiEndpoint or method is missing from config')
        }

        //Create request line, date format (RFC7231), Convert String To Sign
        const requestLine = `${config.apiMethod.toUpperCase()} ${config.apiEndpoint} HTTP/1.1`
        const formattedDate = new Date().toUTCString()
        const stringToSign = `date: ${formattedDate}\n${requestLine}`
    
        //Generate body digest (only for methods with body)
        const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE']
        const hasBody = methodsWithBody.includes(config.apiMethod.toUpperCase())
        let bodyDigest = ''

        if(hasBody && config.Body) { 
            const bodyString = typeof config.Body === 'string'
                ? config.Body
                : JSON.stringify(config.Body)
            bodyDigest = this.generateBodyDigestParam(bodyString)
        }

        //set signature
        const signature = this.generateHmacSignatureParam(stringToSign, clientSecret)
        
        //build headers
        const headers = { 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Date': formattedDate,
                'Authorization': `hmac username="${clientKey}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`,
        }
        if(bodyDigest) { 
            headers['Digest'] = `SHA-256=${debugInfo.bodyDigest}`
        }

        return headers
    }
}

module.exports = HmacAuthService