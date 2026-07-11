class UsersController < Clearance::UsersController
	def edit
		@user = User.find(current_user.id)
	end

	def update
		@user = User.find(current_user.id)

		if params[:user]
			params.permit!
			User.update(params[:id], params[:user])
		end

		# The profile page offers a single button that switches the member
		# between playing in events and running them as a game master.
		case params[:commit]
		when "I am a game master."
			@user.game_master!
		when "I am a player."
			@user.player!
		end
		redirect_to edit_user_path
	end

	def create
		@user = user_from_params

		respond_to do |format|
			if @user.save
				format.html { redirect_to action: "new", notice: 'User was succesfully created.'}
				format.js {}
				UserMailer.welcome_email(@user).deliver_now
			else
				@user_js = @user.errors.to_json
				format.html { render action: "new", notice: 'The email has been taken.'}
				format.js {render "new.js.erb"}
			end
		end
	end

	private

end
