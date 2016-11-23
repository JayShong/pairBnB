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
  end

  def edit

  end

  def update
  end

  def destroy
  end

  private

  def listings_params

    params.require(:listing).permit(:address, :location, :price, :description, :user_id)
  end

end
