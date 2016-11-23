class UsersController < Clearance::UsersController
	def edit
	end

	def edit
		@user = User.find(current_user.id)
	end

	def update
		@user = User.find(current_user.id)
		if @user.role == "tenant"
			User.update(current_user.id, role: 1)
		elsif @user.role == "landlord"
			User.update(current_user.id, role: 0)
		end
		redirect_to edit_user_path
	end

	def create
		@user = user_from_params

		respond_to do |format|
			if @user.save
				format.html { redirect_to @user, notice: 'User was succesfully created.'}
				format.js {}

			else
				@user_js = @user.errors.to_json
				format.html { render action: "new", notice: 'The email has been taken.'}
				format.js {render "new.js.erb"}
			end
		end
	end

end
