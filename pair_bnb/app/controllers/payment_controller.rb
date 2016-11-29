class PaymentController < ApplicationController
  def index
  	@client_token = Braintree::ClientToken.generate
  end

  def checkout
  	nonce_from_the_client = params[:payment_method_nonce]
  	@result = Braintree::Transaction.sale(amount: "10.00", payment_method_nonce: nonce_from_the_client, :options => {:submit_for_settlement => true})
  end
end
