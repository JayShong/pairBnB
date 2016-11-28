class UsersController < Clearance::UsersController
	def edit
	end

	def edit
		@user = User.find(current_user.id)
	end

	def update
		@user = User.find(current_user.id)

		if params[:user]
			params.permit!
			User.update(params[:id], params[:user])
		end

		if params[:commit] == "I am a landlord." || "I am a tenant."
			if @user.role == "tenant"
				User.update(current_user.id, role: 1)
			elsif @user.role == "landlord"
				User.update(current_user.id, role: 0)
			end
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
