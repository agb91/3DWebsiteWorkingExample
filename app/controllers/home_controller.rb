class HomeController < ApplicationController
  def index
    @source = "http://mrdoob.github.io/three.js/examples/css3d_periodictable.html"
    @name = "css3d_periodictable"
  end
end
