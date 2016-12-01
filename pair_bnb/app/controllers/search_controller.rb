class SearchController < ApplicationController
  def index
    @search = Search.new
  end

  def amenitylisting

  end

  def create
  	# Parameters: {search"=>{"address"=>"235", "location"=>"", "low_price"=>"", "high_price"=>""}}
 	params.permit!
 	@output = Search.query(params[:search])

 	@listings = @output.paginate(:page => params[:page])
 
  	@search = Search.new	#for new search
  	flash[:notice] = 'Your search results.'	#inform search had been performed
	respond_to do |format|
				format.html { render "index"}	#render page
	end
  end
end
