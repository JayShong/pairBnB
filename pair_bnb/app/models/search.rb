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
	end

	# Filters LARP event listings by venue address, region and price range.
	def self.query(filter_params)
		if filter_params[:high_price].empty?
			filter_params[:high_price] = 999999
		end
		if filter_params[:low_price].empty?
			filter_params[:low_price] = 0
		end

		@output = Listing.all
		unless filter_params[:address].empty?
			@output = @output.search_address(filter_params[:address])
		end
		unless filter_params[:location].empty?
			@output = @output.search_location(filter_params[:location])
		end
		@output = @output.where(price: filter_params[:low_price].to_i..filter_params[:high_price].to_i)

		return @output
	end
end
