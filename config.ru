$LOAD_PATH.unshift(File.expand_path(File.join(File.dirname(__FILE__), 'lib')))

require 'bundler/setup'
require 'application'

run Application
