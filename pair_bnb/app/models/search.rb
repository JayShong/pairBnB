class Search < ActiveRecord::Base


	def self.filter_params(input)
		input.each do |keys|
			if keys[1] == ""
				input.delete("#{keys[0]}")
			end
		end
		return input
	end

end
