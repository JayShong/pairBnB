class ReservationsController < ApplicationController

	def new
		@listing = Listing.find(params[:listing_id])
		@reservation = Reservation.new()
		if Reservation.find_by(listing_id: params[:listing_id]).blank?
		else
			@bookings = Reservation.where(listing_id: params[:listing_id]).order('check_in_date ASC')
		end
	end

	def create
		params.permit!
		params[:reservation][:listing_id] = params[:listing_id]
		params[:reservation][:user_id] = current_user.id
		@reservation = Reservation.new(params[:reservation])

		respond_to do |format|
			if @reservation.save
				format.html { redirect_to listing_path(params[:listing_id]), notice: 'Reservation was succesfully created.'}
				format.js {}
			end
		end
	end
end
