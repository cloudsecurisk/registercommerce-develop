function buildSubIds(query, headers, requestName = []) {
  return new Promise((resolve) => {
    let transactionLogsRequest = false;

    const subIdHeader = [];
    const newHeaders = headers.map((row) => {
      if (requestName.find(field => field === 'transactionLogs')) {
        if (row.id === 'transaction.transactionLogs.request') {
          transactionLogsRequest = true;
          subIdHeader.push({
            subId: row.subId
          });
          return { id: `${row.id}.${row.subId}`, title: row.title };
        }
      }
      return row;
    });

    const newQuery = query.map((row) => {
      if (transactionLogsRequest) {
        try {
          const request = JSON.parse(row['transaction.transactionLogs.request']);

          let envio = null;

          if (request.items) {
            const costoEnvio = request.items.find(item => item.name === 'Tarifa de envio');
            if (costoEnvio && costoEnvio.price) {
              envio = costoEnvio.price;
            }
          }

          return {
            ...row,
            ...(request.cardHolder && request.cardHolder.name)
              ? { 'transaction.transactionLogs.request.cardHolder.name': request.cardHolder.name }
              : null,
            ...(request.transaction && request.transaction.cardHolderName)
              ? { 'transaction.transactionLogs.request.transaction.cardHolderName': request.transaction.cardHolderName }
              : null,
            ...(request.items)
              ? { 'transaction.transactionLogs.request.items.costoEnvio': envio }
              : null
          };
        } catch (err) { console.log(err); }
      }
      return row;
    });

    resolve({ query: newQuery, headers: newHeaders });
  });
}

module.exports = {
  buildSubIds
};
