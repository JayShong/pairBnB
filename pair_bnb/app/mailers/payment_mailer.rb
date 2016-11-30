class PaymentMailer < ApplicationMailer
	def payment_email(listing, amount, tenant)

		@user = tenant
		@amount = amount
		@listing_address = listing.address
		mail(to: @user.email, 
		 	subject: "Payment confirmation.") #do |format|
		# 	format.html { render 'welcome_email'}
		# 	format.text { render text: 'welcome_email'}
		# end
	end
end
