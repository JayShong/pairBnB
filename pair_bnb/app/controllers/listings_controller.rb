class ListingsController < ApplicationController
  def index
    @listings = Listing.paginate(page: params[:page])
  end

  def new
  end

  def create
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
