# A listing is a LARP event hosted by a game master: it has a venue
# address, a region, a price per player per day, and a set of amenities
# (props, costume rental, camping, and so on).
class Listing < ActiveRecord::Base
	include PgSearch
	pg_search_scope :search_address, :against => :address, :using => {:tsearch => {:any_word => true}}
	pg_search_scope :search_location, :against => :location, :using => {:tsearch => {:any_word => true, :dictionary => "english"}}

	belongs_to :user
	has_many :amenity_listings
	has_many :amenities, through: :amenity_listings
	has_many :reservations

	default_scope { order(price: :desc) }

	def amenity_names
		amenities.map(&:name).join(", ")
	end
end
