const https = require('https');
function getSSLCertificateExpiryDate(hostname) {
  return new Promise((resolve, reject) => {
    const options = {
      host: hostname,
      port: 443,
      method: 'GET',
      rejectUnauthorized: false // Ignore self-signed certificates
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate();
      if (!cert || !cert.valid_to) {
        reject(new Error(`No SSL certificate found for ${hostname}`));
      } else {
        resolve(new Date(cert.valid_to));
      }
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Example usage
getSSLCertificateExpiryDate('www.example.com')
  .then((expiryDate) => {
    console.log(`SSL certificate for www.example.com expires on ${expiryDate}`);
  })
  .catch((error) => {
    console.error(`Error occurred while checking SSL certificate: ${error.message}`);
  });
