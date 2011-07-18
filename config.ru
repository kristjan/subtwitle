$LOAD_PATH.unshift(File.expand_path(File.join(File.dirname(__FILE__), 'lib')))

require 'bundler/setup'
require 'haml'
require 'omniauth'
require 'sinatra/base'
require 'application'

use Rack::Session::Cookie, :key => 'rack.session',
                           :domain => 'subtwitles.com',
                           :path => '/',
                           :expire_after => 60*24*365*10,
                           :secret => ENV['SESSION_KEY']
use OmniAuth::Builder do
  provider :twitter, ENV['TWITTER_CONSUMER_KEY'],
                     ENV['TWITTER_CONSUMER_SECRET']
end

run Application
