class User < ActiveRecord::Base
  include Clearance::User

    mount_uploaders :avatars, AvatarUploader

    has_many :listings
    has_many :authentications, :dependent => :destroy
    has_many :reservations

  def self.create_with_auth_and_hash(authentication,auth_hash)
    create! do |u|
      u.password = Time.now.to_s
      u.email = auth_hash["extra"]["raw_info"]["email"]
      u.authentications<<(authentication)
    end
  end

  def fb_token
    x = self.authentications.where(:provider => :facebook).first
    return x.token unless x.nil?
  end

  def password_optional?
    true
  end

  # Players attend LARP events; game masters host them.
  # The order maps to the integers already stored in the role column
  # (0 was tenant, 1 was landlord).
  enum role: [:player, :game_master, :admin]
end
