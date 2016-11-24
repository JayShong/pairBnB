class Listing < ActiveRecord::Base
	belongs_to :user
	has_one :amenity

	default_scope { order(price: :desc) }
end
