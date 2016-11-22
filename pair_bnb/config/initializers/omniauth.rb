Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, 'REDACTED-FACEBOOK-APP-ID', 'REDACTED-FACEBOOK-APP-SECRET'
end