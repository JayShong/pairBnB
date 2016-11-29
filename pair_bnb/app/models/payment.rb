class Payment < ActiveRecord::Base
	has_one :reservation
end
