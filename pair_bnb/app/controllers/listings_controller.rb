class ListingsController < ApplicationController
  def index
    @listings = Listing.paginate(page: params[:page])
  end

  def new
    @listings = Listing.new
  end

  def create
    byebug
    @listings = params[:listing]
    @listings = Listing.create(@listings)

        respond_to do |format|
      if @listings.save
        format.html { redirect_to @listings, notice: 'Listing was succesfully created.'}
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

end
