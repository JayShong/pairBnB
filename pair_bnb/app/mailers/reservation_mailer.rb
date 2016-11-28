class ReservationMailer < ApplicationMailer

	def reservation_email(listing_address, tenant, landlord_email)

		@user = landlord_email
		@customer = tenant
		@listing = listing_address
		@url = 'http://localhost:3000'
		mail(to: @user, 
		 	subject: "hello!") #do |format|
		# 	format.html { render 'welcome_email'}
		# 	format.text { render text: 'welcome_email'}
		# end
	end
end
