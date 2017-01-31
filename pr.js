document.querySelector('#checkout').addEventListener('click', () =>{
  if (!window.PaymentRequest) {
    // Caso entre nesta condicional, você pode ativar um checkout customizado de fallback
    console.log('Este browser não suporta a Payment Request API! :(');
    return;
  }

  // Métodos de pagamento suportados
  const supportedInstruments = [{
      supportedMethods: ['visa', 'mastercard', 'amex', 'discover','diners', 'jcb', 'unionpay']
  },{
    // Integração com Android Pay
    supportedMethods: ['https://android.com/pay'],
    data: {
      // Seu merchantId deve ser em https://androidpay.developers.google.com/signup
      merchantId: '02510116604241796260',
      environment: 'TEST',
      // Bandeiras de cartão de crédito aceitos no Android Pay
      allowedCardNetworks: ['AMEX', 'MASTERCARD', 'VISA', 'DISCOVER'],
      paymentMethodTokenizationParameters: {
        tokenizationType: 'GATEWAY_TOKEN',
        parameters: {
          'gateway': 'stripe',
          // Coloque aqui sua chave pública do Stripe
          'stripe:publishableKey': 'pk_live_fD7ggZCtrB0vJNApRX5TyJ9T',
          'stripe:version': '2016-07-06'
        }
      }
    }
  }];

  // Detalhes para Checkout
  const details = {
    displayItems: [{
      label: 'Playstation VR',
      amount: { currency: 'BRL', value: '2899.00' }
    }, {
      label: 'Cupom Promocional: XPTO',
      amount: { currency: 'BRL', value: '-9.00' }
    }],
    total: {
      label: 'Total',
      amount: { currency: 'BRL', value : '2890.00' }
    }
  };

  const options = {
   requestPayerEmail: true
  };

  // Com as configurações previamente coletadas da transação
  // Crie uma instância do `PaymentRequest`
  const request = new PaymentRequest(supportedInstruments, details, options);

  // E finalmente exiba a interface nativa através do método `.show()`
  request.show()
  .then(result => {
    // Demo: Submetendo dados para servidor
    return fetch('/pay', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.toJSON())
    }).then(response => {
      // Exiba o status sobre o pagamento
      if (response.status === 200) {
        // Pagamento foi um sucesso
        return result.complete('success');
      } else {
        // Pagamento falhou
        return result.complete('fail');
      }
    }).catch(() => {
      return result.complete('fail');
    });
  });
});
