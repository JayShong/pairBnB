class CreateAmenities < ActiveRecord::Migration
  def change
    create_table :amenities do |t|
      t.string :icon_url
      t.timestamps null: false
    end
  end
end

#each row is an amenity
#wifi, kettle, washing machine, microwave_over, kitchen_utensils
#each column > icon URL