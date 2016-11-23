class ListingsController < ApplicationController
  def index
    @listings = Listing.paginate(page: params[:page])
  end

  def new
    @listing = Listing.new
  end

  def create
    input = listings_params
    input[:user_id] = current_user.id

    @listing = Listing.create(input)

        respond_to do |format|
      if @listing.save
        format.html { redirect_to listing_path(id: @listing.id), notice: 'Listing was succesfully created.'}
        format.js {}
      end
    end
  end

  def show
    @listing = Listing.find(params[:id])
  end

  def edit
    @listing = Listing.find(params[:id])
  end

  def update
    @editted_listing = Listing.update(params[:id], listing_params)

    redirect_to listing_path(id: params[:id])
  end

  def destroy
    Listing.find(params[:id]).destroy

    redirect_to listings_path
  end

  private

  def listings_params
    params.require(:listing).permit(:address, :location, :price, :description, :user_id)
  end

  def listing_params
    params.require(:listing).permit(:address, :location, :price, :description)
  end

end
