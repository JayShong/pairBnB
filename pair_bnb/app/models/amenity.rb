class Amenity < ActiveRecord::Base
	# include PgSearch
	# multisearchable :against => [:name]
	has_many :amenity_listings

	mount_uploader :avatars, AvatarUploader
end
