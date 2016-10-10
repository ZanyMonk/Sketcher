var Sketcher = Sketcher || {};

/*
/	A small batch of colors, while waiting for a proper Color module
*/
Sketcher.Color = {
	white: "#fff",
	black: "#000",
	red: "#f00",
	green: "#0f0",
	blue: "#00f",
	orange: "#ffb603",
	lightblue: "#a6f7ff",
	lightgreen: "#7abf30",
	pink: "#f70e93",
	purple: "#ae22f6"
};

/*
/	Core singleton
/	Main module that controls the drawing frame and holds user's settings
*/
Sketcher.Core = (function(document, window) {

	// Constructor
	function CoreSingleton() {
		this.frame = Sketcher.createElement('sketcher_layers', Sketcher.node);
		this.layers = [];
		this.selectedLayer;
		this.clicked = false;
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.color = Sketcher.Color.red;

		this.tool = Sketcher.Tools.getTool();

		/***** EVENTS *****/
		this._onMouseUp = function(e) {
			this.clear(this.layers[0].getContext());

			if(this.clicked) {
				var ctx = this.selectedLayer.getContext();
				this.tool.onMouseUp(e, ctx);
				this.selectedLayer.menuItem.updateThumbnail();
			}

			if(!e.shiftKey) {
				this.frame.removeEventListener("mousemove", this.onMouseMove);
				this.clicked = false;
			}
		};

		this._onMouseDown = function(e) {
			if(e.button == 0 && !this.clicked) {
				this.clicked = true;
				this.tool.onMouseDown(e, this.selectedLayer.getContext());
				this.frame.addEventListener("mousemove", this.onMouseMove);
			}else if(e.button == 2 && this.clicked) {
				e.preventDefault();
				e.stopPropagation();
				this.clicked = false;
			}
		}

		this._onMouseMove = function(e) {
			if(e.offsetX < 0 || e.offsetY < 0 ||  e.offsetX > this.width || e.offsetY > this.height || !this.clicked) {
				onMouseUp(e);
			} else {
				var ctx = this.layers[0].getContext();
				this.clear(ctx);
				this.tool.onMouseMove(e, ctx);
			}
		}

		/***** PRIVATE *****/
		this.clear = function(ctx) {
			ctx.clearRect(0, 0, this.width, this.height);
		}

		this.getLayerOnLevel = function(n) {
			var ret = null;

			this.layers.forEach(function(layer) {
				if(layer.zIndex == n) {
					ret = layer;
				}
			});

			return ret;
		}

		this.addLayer = function(name, zIndex = 0) {
			var i = this.layers.push(
				new Layer(
					name,
					zIndex == 0 ? this.countLayers() : zIndex,
					this.width,
					this.height,
					this.frame
				)
			);
			this.selectLayer(this.layers[i-1].id);
		}

		/***** PUBLIC *****/

		this.countLayers = function() {
			var c = 0;

			this.layers.forEach(function() {
				c++;
			});

			return c;
		}

		this.addLayerPrompt = function() {
			var name = prompt("Please enter layer name", "Foreground");
			if(name === null) {
				return false;
			} else {
				name = name.toLowerCase();
				this.addLayer(name);

				return true;
			}
		}

		this.getLayer = function(id) {
			var ret = null;

			this.layers.forEach(function(layer) {
				if(layer.id == id) {
					ret = layer;
				}
			});

			return ret;
		}

		this.getLayers = function() {
			if(this.countLayers() == 1) {
				return [];
			}

			var ret = [];

			var lvl = 1;
			var layer;
			while(ret.length < this.countLayers()-1) {
				layer = this.getLayerOnLevel(lvl++);
				if(layer != null)
					ret.push(layer);
			}

			return ret.reverse();
		}

		this.selectLayer = function(id) {
			var layer = this.getLayer(id);
			if(layer != null) {
				// Blur each layer
				this.layers.forEach(function(l) {
					l.blur();
				});

				// Select the new one
				this.selectedLayer = layer;
				layer.select();
				return true;
			} else {
				console.error('No layer with id "'+id+'".');
				return false;
			}
		}

		this.deleteLayer = function(id) {
			var layer = this.getLayer(id);
			if(layer != null) {
				layer.node.remove(); // Destruct DOM node

				// Searching for first layer after the one just removed
				var index = -1;
				this.layers.forEach(function(layer, i) {
					if(layer.id == id) {
						index = i;
					}
				});

				// Decrement z-index of the layers above the one just removed
				this.layers.slice(index).forEach(function(layer) {
					layer.zIndex--;
					layer.update();
				});

				// Forget the removed layer
				delete this.layers[index];

				return true;
			} else {
				console.error('No layer with id "' + id + '".');

				return false;
			}
		}

		/***** SLOTS *****/
		this.setLayerVisibility = function(id, visibility) {
			this.getLayer(id).setVisibility(visibility);
		}

		this.toggleLayerVisibility = function(id) {
			this.getLayer(id).toggleVisibility();
		}

		this.raiseLayer = function(id) {
			var layer = this.getLayer(id);
			var prev = this.getLayerOnLevel(layer.zIndex+1);

			if(prev == null || prev.name == "trackpad") {
			   return false;
			} else {
				layer.zIndex++;
				layer.update();

				prev.zIndex--;
				prev.update();
			}
		}

		this.demoteLayer = function(id) {
			var layer = this.getLayer(id);
			var next = this.getLayerOnLevel(layer.zIndex-1);

			if(next == null || next.name == "trackpad") {
			   return false;
			} else {
				layer.zIndex--;
				layer.update();

				next.zIndex++;
				next.update();
			}
		}

		this.selectColor = function(colorName) {
			if(colorName in Sketcher.Color) {
				this.tool.setColor(Sketcher.Color[colorName]);
				return true;
			} else {
				console.error(colorName+" is not a color.");
				return false;
			}
		}

		this.getSelectedColor = function() {
			return this.color;
		}

		// Initialize singleton
		this.frame.style.width = this.width+"px";
		this.frame.style.height = this.height+"px";

		// Add the needed trackpad layer and a first drawing layer
		this.addLayer("trackpad", 100);
		this.addLayer("background");

		// Bind "this" to events
		this.onMouseUp = this._onMouseUp.bind(this);
		this.onMouseDown = this._onMouseDown.bind(this);
		this.onMouseMove = this._onMouseMove.bind(this);

		// Make the frame listen to those events
		this.frame.addEventListener("contextmenu", function(e) { e.preventDefault(); });
		this.frame.addEventListener("mouseup", this.onMouseUp);
		this.frame.addEventListener("mousedown", this.onMouseDown);

		// Return public methods
		return {
			addLayer: this.addLayerPrompt.bind(this),
			getLayer: this.getLayer.bind(this),
			getLayers: this.getLayers.bind(this),
			selectLayer: this.selectLayer.bind(this),
			getSelectedLayer: (function() { return this.selectedLayer; }).bind(this),
			getLayerOnLevel: this.getLayerOnLevel.bind(this),
			countLayers: this.countLayers.bind(this),
			deleteLayer: this.deleteLayer.bind(this),
			raiseLayer: this.raiseLayer.bind(this),
			demoteLayer: this.demoteLayer.bind(this),
			setLayerVisibility: this.setLayerVisibility.bind(this),
			toggleLayerVisibility: this.toggleLayerVisibility.bind(this),
			selectColor: this.selectColor.bind(this),
			getSelectedColor: (function() { return this.color; }).bind(this),
			getWidth: (function() { return this.width }).bind(this),
			getHeight: (function() { return this.height }).bind(this)
		};
	}

	// Let's assume this is a singleton
	var instance = (instance || new CoreSingleton());

	return instance;
})(document, window);
