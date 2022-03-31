class ShortLinksController < ApplicationController

  def show
    @link = ShortLink.find_by_slug(params[:slug]) 
    if @link.nil?
      render json: {message: "It seems you have tried a wrong link"}, status: 404 
    else
      redirect_to @link.url
    end
  end
end