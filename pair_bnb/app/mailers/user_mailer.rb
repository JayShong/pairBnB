class UserMailer < ApplicationMailer
	default from: 'tjstartupfinance@gmail.com'

	def welcome_email(user)
		@user = user
		@url = 'http://localhost:3000'
		mail(to: @user.email, 
		 	subject: "hello!") #do |format|
		# 	format.html { render 'welcome_email'}
		# 	format.text { render text: 'welcome_email'}
		# end
	end
end
