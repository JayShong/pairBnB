class ReservationMailer < ApplicationMailer

	# Lets the game master know a player has booked a spot at their event.
	def reservation_email(listing_address, player_email, game_master_email)

		@user = game_master_email
		@customer = player_email
		@listing = listing_address
		@url = 'http://localhost:3000'
		mail(to: @user,
		 	subject: "A player booked a spot at your LARP event!")
	end
end
