class Search < ActiveRecord::Base


	def self.filter_params(input)
		input.each do |keys|
			if keys[1] == ""
				input.delete("#{keys[0]}")
			end
		end
		output = input.symbolize_keys
		if output[:low_price]
			output.delete(:low_price)
		end
		if output[:high_price]
			output.delete(:high_price)
		end
		return output

		# {"address"=>"Jalan Testing 5"}

	end

	def self.query(filter_params)
		# filter_params = {"address"=>"", "location"=>"", "low_price"=>"", "high_price"=>"", "amenitylisting"=>{"amenity_ids"=>["1", "2", ""]}}
		# prepare params
		# byebug
		if filter_params[:high_price].empty?
  		filter_params[:high_price] = 999999
  		end
		if filter_params[:low_price].empty?
  		filter_params[:low_price] = 0
  		end

  		#begin filtering
  		#Filter by amenities
  # 		filter_params[:amenitylisting][:amenity_ids].pop
  # 		if filter_params[:amenitylisting][:amenity_ids].empty?
  # 			#take all listings
  # 			@output = Listing.all
  # 		else
  # 			@all_amenities = AmenityListing.all
  # 			@merged_result = AmenityListing.all
  # 			filter_params[:amenitylisting][:amenity_ids].each do |id|
  # 				result = @all_amenities.where(amenity_id: id)
  # 				@merged_result = result.merge(result)
  # 			end
  # 			#find all listings ids 
  # 			listing_ids = []
  # 			@output.each do |id|
  # 				listings_ids << id.listing_id
  # 			end
  # 			#create new base listing for next filter process
  # 			@output = Listing.where(id: listings_ids)
  # 		end

		# filter_params.delete("amenitylisting")
  		#filter by address query
		if filter_params[:address].empty?
		else
			@output = @output.search_address(filter_params[:address])
		end
		#filter by location query
		if filter_params[:location].empty?
		else
			@output = @output.search_location(filter_params[:location])
		end
		#filter by price query
		@output = @output.where(price: filter_params[:low_price].to_i..filter_params[:high_price].to_i)

		return @output
	end
end

# (byebug) params[:search][:amenitylisting][:amenity_ids].length
# 3
# (byebug) params[:search][:amenitylisting][:amenity_ids]
# ["2", "3", ""]
# (byebug) params[:search][:amenitylisting][:amenity_ids].split
# [["2", "3", ""]]
# (byebug) params[:search][:amenitylisting][:amenity_ids].join
# "23"
# (byebug) params[:search][:amenitylisting][:amenity_ids]
# ["2", "3", ""]
# (byebug) params[:search][:amenitylisting][:amenity_ids][0]
# "2"
# (byebug) test = params[:search][:amenitylisting][:amenity_ids][0]
# "2"
# (byebug) AmenityListing.where(amenity_id: test)
