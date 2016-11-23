class SessionsController < Clearance::SessionsController
	if respond_to?(:before_action)
    before_action :redirect_signed_in_users, only: [:new]
    skip_before_action :require_login,
      only: [:create, :new, :destroy],
      raise: false
    skip_before_action :authorize,
      only: [:create, :new, :destroy],
      raise: false
  else
    before_filter :redirect_signed_in_users, only: [:new]
    skip_before_filter :require_login,
      only: [:create, :new, :destroy],
      raise: false
    skip_before_filter :authorize,
      only: [:create, :new, :destroy],
      raise: false
  end


  def create_from_omniauth
        auth_hash = request.env["omniauth.auth"]

        authentication = Authentication.find_by_provider_and_uid(auth_hash["provider"], auth_hash["uid"]) || Authentication.create_with_omniauth(auth_hash)
        if authentication.user
          user = authentication.user 
          authentication.update_token(auth_hash)
          session[:user_id] = user.id
          @next = listings_path
          @notice = "Signed in!"
        else
          user = User.create_with_auth_and_hash(authentication,auth_hash)
          @next = listings_path 
          session[:user_id] = user.id
          @notice = "Signed in!"
        end
        sign_in(user)
        redirect_to @next, :notice => @notice
     end

  def create
    @user = authenticate(params)
    byebug
    sign_in(@user) do |status|
      if status.success?
         url_after_create
      else
        flash.now.notice = status.failure_message
        render template: "sessions/new", status: :unauthorized
      end
    end
  end

  def url_after_create
    redirect_to listings_path
  end

end
