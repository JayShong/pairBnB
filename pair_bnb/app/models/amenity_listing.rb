class AmenityListing < ActiveRecord::Base
	belongs_to :amenity
	belongs_to :listing

	validates_uniqueness_of :amenity_id, scope: :listing_id

end
