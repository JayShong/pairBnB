class Listing < ActiveRecord::Base
	belongs_to :user

	default_scope { order(price: :desc) }
end
