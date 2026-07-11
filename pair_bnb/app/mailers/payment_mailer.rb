class PaymentMailer < ApplicationMailer
	def payment_email(listing, amount, player)

		@user = player
		@amount = amount
		@listing_address = listing.address
		mail(to: @user.email,
		 	subject: "LARPnB payment confirmation")
	end
end
