class Listing < ActiveRecord::Base
	belongs_to :user
	has_many :amenity_listings
	has_many :amenities, through: :amenity_listings


	default_scope { order(price: :desc) }

	def has_amenities
	if self.amenities
      amenities = []
      amenity_names = @listing.amenities
      amenity_names.each do |amenity| amenities << amenity.name end
    end

    if amenities.include?"Wifi"
        @wifi = true end
	end
end
