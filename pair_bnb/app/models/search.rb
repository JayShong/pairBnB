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
		# filter_params = {:address=>"Jalan", :location=>"test", :low_price=>"300", :high_price=>"500"}
		if filter_params[:high_price].empty?
  		filter_params[:high_price] = 999999
  		end
		if filter_params[:low_price].empty?
  		filter_params[:low_price] = 0
  		end

  		#begin filtering
		if filter_params[:address].nil?
		else
			@output = Listing.search_address(filter_params[:address])
		end

		if filter_params[:location].nil?
		else
			@output = @output.search_location(filter_params[:location])
		end
			@output = @output.where(price: filter_params[:low_price].to_i..filter_params[:high_price].to_i)

		return @output
	end
end
