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

	def self.query_search_builder(filter_params)
		# filter_params = {:address=>"Jalan", :location=>"test", :low_price=>"300", :high_price=>"500"}

	end
end
