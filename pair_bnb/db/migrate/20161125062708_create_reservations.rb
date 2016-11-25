class CreateReservations < ActiveRecord::Migration
  def change
    create_table :reservations do |t|
      t.integer :listing_id
      t.integer :user_id
      t.date :check_in_date
      t.date :check_out_date
      t.string :comments, :default => 0

      t.timestamps null: false
    end
  end
end
