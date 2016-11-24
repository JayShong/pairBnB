class Amenity < ActiveRecord::Base
	has_many :amenitylisting

	# mount_uploader :avatar, AvatarUploader
end
