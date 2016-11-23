class CreateListings < ActiveRecord::Migration
  def change
    create_table :listings do |t|
      t.string :address
      t.string :location
      t.integer :price
      t.integer :user_id
      t.string :description

      t.timestamps null: false
    end
  end
end
