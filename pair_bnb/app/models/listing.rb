class Listing < ActiveRecord::Base
	belongs_to :user
	has_many :amenities, through: :amenity_listing

	default_scope { order(price: :desc) }
end
