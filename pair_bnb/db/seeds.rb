# Seed data for the LARPnB community.
# Load with rake db:seed (or created alongside the db with db:setup).

# Amenities a game master can offer at an event.
[
  "Props Provided",
  "Costume Rental",
  "Weapons Armory",
  "On-site Camping",
  "Meals Included"
].each do |name|
  Amenity.find_or_create_by!(name: name)
end

game_master = User.find_or_initialize_by(email: "gamemaster@larpnb.example")
if game_master.new_record?
  game_master.password = "change-me-quickly"
  game_master.role = :game_master
  game_master.save!
end

[
  {
    address: "Blackwood Forest Campground, Trail 7",
    location: "Blackwood",
    price: 45,
    description: "The Blackwood Chronicles — a weekend-long dark fantasy campaign of feuding clans and forest spirits."
  },
  {
    address: "Ravenhurst Castle, 12 Keep Road",
    location: "Ravenhurst",
    price: 80,
    description: "Court of Ravens — political intrigue and masquerade in a real castle. Formal garb required."
  },
  {
    address: "Old Quarry Airsoft Field, Gate B",
    location: "Stonehaven",
    price: 30,
    description: "Wasteland 2099 — post-apocalyptic survival LARP. Scavenge, trade, and outlast the raiders."
  },
  {
    address: "Community Hall, 5 Guild Street",
    location: "Milltown",
    price: 15,
    description: "The Silver Goblet Murders — a one-night murder mystery for first-time players."
  }
].each do |event|
  Listing.find_or_create_by!(event.merge(user_id: game_master.id))
end
