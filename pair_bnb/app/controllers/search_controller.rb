class SearchController < ApplicationController
  def index
    @search = Search.new
  end


  def create
  	# Parameters: {search"=>{"address"=>"235", "location"=>"", "low_price"=>"", "high_price"=>""}}
 	params.permit!

  	filtered_params = Search.filter_params(params[:search])   	#filter params
  	byebug
  	if params[:search][:high_price].nil?
  		params[:search][:high_price] = 999999
  	end
  	# query = Search.query_search_builder(filtered_params)
  	@first_listings = Listing.where(filtered_params)  	# perform search
  	 	byebug
  	@listings = @first_listings.where(price: params[:search][:low_price].to_i..params[:search][:high_price]).paginate(:page => params[:page])   	# perform search
  	@search = Search.new	#for new search
  	flash[:notice] = 'Your search results.'	#inform search had been performed
	respond_to do |format|
				format.html { render "index"}	#render page
	end
  end
end
