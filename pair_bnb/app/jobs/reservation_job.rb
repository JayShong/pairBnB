class ReservationJob < ActiveJob::Base
  queue_as :default

  def perform(*args)
    ReservationMailer.reservation_email.(@reservation.listing.address, current_user.email, @reservation.listing.user.email)
  end
end
