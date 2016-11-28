class ReservationsController < ApplicationController

	def index
		@user = User.find(current_user.id)

		if Reservation.find_by(user_id: current_user.id).blank?
			@have_reservations = false
		else
			@reservations = Reservation.where("user_id = ? AND check_out_date > ?", current_user.id, Date.today)
			if @reservations.blank?
				@have_reservations = false
			else
				@have_reservations = true
			end
		end
	end

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
			else
				format.html { redirect_to new_listing_reservation_path(params[:listing_id]), notice: 'Reservation cannot be made.'}
			end
		end
	end
end
