const { Logging } = require('@google-cloud/logging');

class Logger {
  // 'global': Uso genérico. Se usa cuando no se puede especificar un recurso más específico.
  // 'cloud_function': Para logs generados desde Google Cloud Functions.
  // 'gce_instance': Para logs provenientes de máquinas virtuales en Google Compute Engine.
  // 'k8s_container': Para contenedores en Kubernetes.
  // 'app_engine': Para aplicaciones en App Engine

  constructor(logName = 'application-log') {
    this.logging = new Logging();
    this.log = this.logging.log(logName);
    this.resource = {
      type: 'global',
    };
  }


  async writeLog(severity, message, metadata = {}) {
    if (process.env.NODE_ENV === 'production') {
      const entry = this.log.entry(
        { resource: this.resource, severity, ...metadata },
        { ...message },
      );
      try {
        return await this.log.write(entry);
        // console.log(`[${severity}] Log enviado:`, message);
      } catch (error) {
        console.error('Error al escribir log:', error);
        return false;
      }
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  otherInfo(req) {
    let ipUser = '';
    // Extraer IP con cascada de ifs
    if (req.headers && req.headers['x-forwarded-for']) {
      ipUser = req.headers['x-forwarded-for'];
    } else if (req.connection && req.connection.remoteAddress) {
      ipUser = req.connection.remoteAddress;
    } else if (req.socket && req.socket.remoteAddress) {
      ipUser = req.socket.remoteAddress;
    } else if (req.ip) {
      ipUser = req.ip;
    }
    const clientContext = {
      device: (req.headers) ? req.headers['espiral-device'] : null,
      ip: ipUser,
      user_agent: req.headers ? req.headers['user-agent'] : null,
      body: req.body
    };

    const requestInfo = {
      Caller_url: req.originalUrl,
      Origin_url: req.headers ? req.headers['X-Origin-URL'] : req.originalUrl,
      method: req.method,
      project: 'RegisterEcommerce',
      // headers: req.headers,
      // body: req.body,
    };

    return { clientContext, requestInfo };
  }

  // eslint-disable-next-line class-methods-use-this
  errorInfo(error) {
    return {
      stack: error && error.stack ? JSON.stringify(error.stack) : null,
      message: error && error.message ? error.message : null,
    };
  }

  info(message, req) {
    const otherinformation = this.otherInfo(req);
    return this.writeLog('INFO', {
      ...message,
      ...otherinformation
    });
  }

  warning(message, req) {
    const otherinformation = this.otherInfo(req);
    return this.writeLog('WARNING', {
      ...message,
      ...otherinformation
    });
  }

  error(data, req, error = null) {
    const otherinformation = this.otherInfo(req);
    const errorInfo = this.errorInfo(error);

    return this.writeLog('ERROR', {
      ...data,
      ...otherinformation,
      errorInfo
    });
  }
}

module.exports = Logger;
