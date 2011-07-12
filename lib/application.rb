require 'sinatra/base'
require 'haml'

class Application < Sinatra::Base
  set :root, File.join(File.dirname(__FILE__), '..')
  set :public, File.join(root, 'public')

  get '/:username?' do
    @username = params[:username]
    haml :index
  end
end
