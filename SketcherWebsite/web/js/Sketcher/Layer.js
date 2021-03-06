/*
/	Layer
/	 Basically a <canvas> handle
/	 Also manages its own item in the layers list
*/
Sketcher.widgets.Layer = function(name, zIndex, width, height, frame, opacity = 1) {
	this.id = Math.round(Math.random()*1000000)%1000000;
	this.name = name;
	this.zIndex = zIndex;
	this.node = document.createElement('canvas');
	this.visible = true;
	this.focus = false;
	this.width = width;
	this.height = height;
	this.opacity = opacity/100;
	this.objects = [];

	this.createMenuItem = function(container) {
		this.menuItem = new Sketcher.widgets.LayerItem(this, container);
		container.appendChild(this.menuItem);
	}

	this.update = function() {
		this.node.style.display = this.visible ? 'block' : 'none';
		this.node.style.zIndex = this.zIndex;
		this.node.style.opacity = this.opacity;

		if(this.menuItem != undefined) {
			this.menuItem.update();
		}
	}

	this.toggleVisibility = function() {
		this.visible = this.visible ? false : true;
		this.update();
	}

	this.setOpacity = function(opacity) {
		if(opacity > 100 || opacity < 0) {
			return false;
		}

		this.opacity = opacity/100;
		this.update();
	}

	this.setVisibility = function(visibility) {
		this.visible = visibility;
		this.update();
	}

	this.isVisible = function() {
		return this.visible;
	}

	this.getContext = function() {
		return this.node.getContext('2d');
	}

	this.select = function() { this.focus = true; }
	this.blur = function() { this.focus = false; }

	this.clear = function() {
		var ctx = this.getContext();
		ctx.clearRect(0, 0, this.width, this.height);
	}

	this.draw = function() {
		var ctx = this.getContext();

		this.objects.forEach(function(o) {
			Sketcher.Tools.drawFromJSON(o, ctx);
		});
	}

	this.node.width = this.width;
	this.node.height = this.height;
	this.node.setAttribute('id', 'sk_layer_'+this.id);
	frame.appendChild(this.node);

	this.update();
};
