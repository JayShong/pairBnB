class UsersController < Clearance::UsersController
	def edit
	end

	def create
		@user = user_from_params

		respond_to do |format|
			if @user.save
				format.html { redirect_to @user, notice: 'User was succesfully created.'}
				format.js {}
				format.json { render json: @user, status: :created, location: @user}
			else
				format.html { render action: "new"}
				format.js {render "new.js.erb"}
				format.json { render json: test, status: :unprocessable_entity }
			end
		end
	end

end
