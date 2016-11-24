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

    # since amenity inputs are in the form of 1, 2, 3. 
    # We build amenitylisting records via identification of such numbers
    amenity_inputs = params[:listing][:amenitylisting][:amenity_ids].join
    if amenity_inputs.include?("1") #wifi
      AmenityListing.create(listing_id: @listing.id, amenity_id: 1)
    end
    if amenity_inputs.include?("2") #microwave_oven
      AmenityListing.create(listing_id: @listing.id, amenity_id: 2)
    end
    if amenity_inputs.include?("3") #kettle
      AmenityListing.create(listing_id: @listing.id, amenity_id: 3)
    end
    if amenity_inputs.include?("4") #washing_machine
      AmenityListing.create(listing_id: @listing.id, amenity_id: 4)
    end
    if amenity_inputs.include?("5") #kitchen_utensils
      AmenityListing.create(listing_id: @listing.id, amenity_id: 5)
    end
    # end tying amenities to listing

        respond_to do |format|
      if @listing.save
        format.html { redirect_to listing_path(id: @listing.id), notice: 'Listing was succesfully created.'}
        format.js {}
      end
    end
  end

  def show
    @listing = Listing.find(params[:id])
    if @listing.amenities
      amenities = []
      amenity_names = @listing.amenities
      amenity_names.each do |amenity| amenities << amenity.name end
    end

    if amenities.include?"Wifi"
        @wifi = true end
    if amenities.include?"Microwave Oven"
        @microwave = true end
    if amenities.include?"Kettle"
        @kettle = true end
    if amenities.include?"Washing Machine"
        @washing_machine = true end
    if amenities.include?"Kitchen Utensils"
        @utensils = true end
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
