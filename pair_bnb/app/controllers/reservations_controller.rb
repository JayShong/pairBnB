class ReservationsController < ApplicationController

	def new
		@listing = Listing.find(params[:listing_id])
		@reservation = Reservation.new

	end

	def create
	end

end
