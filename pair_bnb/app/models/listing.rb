class Listing < ActiveRecord::Base
	belongs_to :user
	has_many :amenitylisting
	has_many :amenities, through: :amenitylisting


	default_scope { order(price: :desc) }

end
