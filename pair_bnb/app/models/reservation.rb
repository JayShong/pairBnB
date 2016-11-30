class Reservation < ActiveRecord::Base
	belongs_to :user
	belongs_to :listing
	belongs_to :payment

	validates :check_in_date, :check_out_date, :overlap => {:scope => "listing_id" }
end
