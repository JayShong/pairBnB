class Amenity < ActiveRecord::Base
	has_many :amenity_listings

	mount_uploader :avatars, AvatarUploader
end
