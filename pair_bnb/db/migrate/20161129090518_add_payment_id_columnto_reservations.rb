class AddPaymentIdColumntoReservations < ActiveRecord::Migration
  def change
  	add_column :reservations, :payment_id, :Integer, :default => :null
  end
end
