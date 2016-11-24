class AddAvatarsToAmenities < ActiveRecord::Migration
  def change
    add_column :amenities, :avatars, :json
    remove_column :amenities, :avatar
  end
end
