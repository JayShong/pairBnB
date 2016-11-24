class CreateAmenityListings < ActiveRecord::Migration
  def change
    create_table :amenity_listings do |t|
      t.integer :listing_id
      t.integer :amenity_id

      t.timestamps null: false
    end
  end
end
