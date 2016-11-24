class AmenityListing < ActiveRecord::Base
	belongs_to :listing
	belongs_to :amenity

end
