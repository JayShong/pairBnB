class CreatePayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.integer :amount
      t.string :nonce

      t.timestamps null: false
    end
  end
end
