class ListingsController < ApplicationController
  def index
    @listings = Listing.paginate(page: params[:page])
  end

  def new
    @listing = Listing.new
  end

  def create
    @listing = Listing.new(listing_params)
    @listing.user_id = current_user.id

    respond_to do |format|
      if @listing.save
        sync_amenities(@listing)
        format.html { redirect_to listing_path(id: @listing.id), notice: 'Your LARP event was successfully listed.'}
        format.js {}
      else
        format.html { render :new }
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
    @listing = Listing.update(params[:id], listing_params)
    sync_amenities(@listing)

    redirect_to listing_path(id: params[:id]), notice: 'Your LARP event was updated.'
  end

  def destroy
    Listing.find(params[:id]).destroy

    redirect_to listings_path, notice: 'Your LARP event was removed.'
  end

  private

  def listing_params
    params.require(:listing).permit(:address, :location, :price, :description)
  end

  # Creates or removes AmenityListing rows so the event's amenities match
  # the checkboxes submitted with the form.
  def sync_amenities(listing)
    selected_ids = params[:listing].fetch(:amenitylisting, {}).fetch(:amenity_ids, [])
    selected_ids = selected_ids.reject(&:blank?).map(&:to_i)

    Amenity.pluck(:id).each do |amenity_id|
      existing = AmenityListing.find_by(listing_id: listing.id, amenity_id: amenity_id)
      if selected_ids.include?(amenity_id)
        AmenityListing.create(listing_id: listing.id, amenity_id: amenity_id) if existing.nil?
      elsif existing
        existing.destroy
      end
    end
  end
end
