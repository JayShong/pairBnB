class ListingsController < ApplicationController
  def index
    @listing = Listings.paginate(page: params[:page])

    default_scope { order(price: :desc) }
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
