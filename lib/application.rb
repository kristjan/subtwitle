class Application < Sinatra::Base
  set :root, File.join(File.dirname(__FILE__), '..')
  set :public, File.join(root, 'public')

  get '/auth/:provider/callback' do
    auth = request.env['omniauth.auth']
    session['twitter'] = {'token'  => auth['credentials']['token'],
                          'secret' => auth['credentials']['secret']}
    redirect '/home'
  end

  get '/user/timeline' do
    headers "Content-Type" => 'text/json'
    if session['twitter']
      client = Twitter::Client.new(
        :oauth_token => session['twitter']['token'],
        :oauth_token_secret => session['twitter']['secret'])
      client.home_timeline.to_json
    end
  end

  get %r{/t/(\d+)(/.*)?} do |tweet_id, image_url|
    haml :index
  end

  get '/:username?/?' do
    @username = params[:username]
    haml :index
  end

  helpers do
    def javascripts(*scripts)
      @_javascripts ||= []
      @_javascripts += scripts
      @_javascripts
    end
  end
end
