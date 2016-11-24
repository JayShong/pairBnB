class AmenityListing < ActiveRecord::Base
	belongs_to :amenity
	belongs_to :listing

end
