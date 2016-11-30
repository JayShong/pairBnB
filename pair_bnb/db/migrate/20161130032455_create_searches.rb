class CreateSearches < ActiveRecord::Migration
  def change
    create_table :searches do |t|
    	t.string :address
    	t.string :location
    	t.integer :low_price
    	t.integer :high_price
    	t.text :amenities, array: true, default: []

      t.timestamps null: false
    end
  end
end
