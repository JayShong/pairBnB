class Listing < ActiveRecord::Base
	belongs_to :user
	has_many :amenity_listings
	has_many :amenities, through: :amenity_listings


	default_scope { order(price: :desc) }
end
