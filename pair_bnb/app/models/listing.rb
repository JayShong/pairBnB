class Listing < ActiveRecord::Base
	belongs_to :user
	has_many :amenity_listings
	has_many :amenities, through: :amenity_listings


	default_scope { order(price: :desc) }

	# def wifi_icon 
	# 	if @wifi == true
	# 		return '<img src="https://s3-ap-southeast-1.amazonaws.com/pairbnb-jay/wifi.jpg">'.html_safe
	# 	end
	# end
	def kettle
    	if self.amenities
     		amenities = []
     		amenity_names = self.amenities
     		amenity_names.each do |amenity| amenities << amenity.name end
   		end

    	if amenities.include?"Kettle"
 			return '<img src="https://s3-ap-southeast-1.amazonaws.com/pairbnb-jay/Kettle-512.png">'.html_safe
		end
	end
	# def washing_machine_icon
	# 	if @washing_machine == true
	# 		return '<img src="https://s3-ap-southeast-1.amazonaws.com/pairbnb-jay/washing-machine-icon-47271.png">'.html_safe
	# 	end
	# end
	# def microwave_icon
	# 	if @microwave == true
	# 		return '<img src="https://s3-ap-southeast-1.amazonaws.com/pairbnb-jay/microwave.png">'.html_safe
	# 	end
	# end
	# def utensils_icon
	# 	if @utensils == true
	# 		return '<img src="https://s3-ap-southeast-1.amazonaws.com/pairbnb-jay/kitchen+utensils.png">'.html_safe
	# 	end
	# end
end
