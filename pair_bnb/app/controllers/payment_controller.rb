class PaymentController < ApplicationController
	protect_from_forgery with: :null_sessions
  def index
  	reservation = Reservation.find(params[:reservation_id])
  	listing = Listing.find(params[:listing_id])
  	reserved_days = reservation.check_out_date - reservation.check_in_date
  	@amount =  listing.price * reserved_days.to_i
  	@client_token = Braintree::ClientToken.generate
  end

  def create
  	# Parameters: {"listing_id"=>"56", "reservation_id"=>"12"}
  	amount = params[:amount]
  	nonce_from_the_client = params[:payment_method_nonce]
  	@result = Braintree::Transaction.sale(amount: amount, payment_method_nonce: nonce_from_the_client, :options => {:submit_for_settlement => true})
  	if @result.success? || @result.transaction
  		@payment = Payment.new(amount: amount, nonce: nonce_from_the_client)
		respond_to do |format|
			if @payment.save
				PaymentMailer.payment_email(Listing.find(params[:listing_id]), amount, current_user).deliver_later
				Reservation.update(params[:reservation_id], payment_id: @payment.id)
				format.html { redirect_to reservations_path, notice: 'Reservation for #{listing.address} was succesfully paid for.'}
			end
		end
    else
        error_messages = result.errors.map { |error| "Error: #{error.code}: #{error.message}" }
			respond_to do |format|
				format.html { redirect_to reservations_path, notice: "#{error_messages}"}
			end
    end

  end
end
