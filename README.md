# LARPnB

A community platform for live action role-play (LARP) events, built on Rails.

Game masters list their upcoming LARP events — the venue, the region, the
price per player per day, the pitch for the adventure, and what the event
provides (props, costume rental, a weapons armory, on-site camping, meals).
Players browse and search events, book a spot for the event dates, and pay
for their booking online.

## How it works

- **Players** sign up (email or Facebook), search events by venue, region and
  price, book a spot with their character name, and pay via Braintree.
- **Game masters** list and manage events, choose the amenities their event
  provides, and get an email whenever a player books a spot.
- Any member can switch between the player and game master roles from their
  profile page.

## Tech

Rails 4.2 · PostgreSQL (pg_search for event search) · Clearance +
omniauth-facebook for auth · Braintree for payments · CarrierWave for
avatar uploads · Sidekiq for background mail delivery.

## Getting started

```
cd pair_bnb
bundle install
rake db:setup   # creates the db, loads the schema, and seeds sample events
rails server
```

Seeding creates the standard amenity list, a sample game master account, and
a handful of example events to explore.

_This project began life as pairBnB, an Airbnb-style clone, and has been
refactored for the LARP community._
