class Reservation < ActiveRecord::Base
	belongs_to :user
	belongs_to :listing

	validates :check_in_date, :check_out_date, :overlap => true
end
