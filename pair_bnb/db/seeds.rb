# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

listings = Listing.create(address: "Road ABCD", location: "Ara", price: rand(0..100), user_id: 1, description: "ABCD")
100.times do listings end