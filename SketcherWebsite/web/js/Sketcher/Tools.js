Sketcher.ToolsAbstract = (function() {

	/*
	*	Abstract Tools
	*/
	function _Tool() { }

	_Tool.prototype.options = {};

	_Tool.prototype.config_context = function(ctx) {
		ctx.fillStyle = this.fill_color;
		ctx.strokeStyle = this.stroke_color;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	};

	// AbstractFunctions
	_Tool.prototype.onMouseDown;
	_Tool.prototype.onMouseMove;
	_Tool.prototype.onMouseUp;

	/*
	* Class Line extends _Tool
	*/
	_Line = function() {
		_Tool.call(this)

		this.p1;
		this.p2;
		this.icon = 'minus';
		this.options = {
			thickness: 1
		};
	}

	_Line.prototype = Object.create(_Tool.prototype);
	_Line.prototype.constructor = _Line;

	_Line.prototype.draw = function(ctx) {
		this.config_context(ctx);

		ctx.lineWidth = this.options.thickness;
		ctx.strokeStyle = this.stroke_color;
		ctx.beginPath();
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x, this.p2.y);
		ctx.closePath();
		ctx.stroke();
	}

	_Line.prototype.onMouseDown = function(e) {
		this.p1 = {
			x: e.offsetX,
			y: e.offsetY
		};

		this.stroke_color = Sketcher.color.foreground.getRGBa();
	}

	_Line.prototype.onMouseMove = function(e, ctx) {
		this.p2 = {
			x: e.offsetX,
			y: e.offsetY
		};
		this.draw(ctx);
	}

	_Line.prototype.onMouseUp = function(e, ctx) {
		this.p2 = {
			x: e.offsetX,
			y: e.offsetY
		};

		return '{ "type": "Line", "data": ' + JSON.stringify(this) + '}';
	}


	/*
	*	Class Rect extends _Tool
	*/
	_Rectangle = function() {
		_Tool.call(this);

		this.icon = 'square';
		this.options = {
			thickness: 1,
			fill: false,
			stroke: true
		};
	}

	_Rectangle.prototype = Object.create(_Tool.prototype);
	_Rectangle.prototype.constructor = _Rectangle;

	_Rectangle.prototype.draw = function(ctx) {
		this.config_context(ctx);
		ctx.lineWidth = this.options.thickness;
		ctx.fillStyle = this.fill_color;
		if(this.options.fill)
			ctx.fillRect(this.p1.x, this.p1.y, this.p2.x - this.p1.x, this.p2.y - this.p1.y);
		ctx.strokeStyle = this.stroke_color;
		if (this.options.stroke)
			ctx.strokeRect(this.p1.x, this.p1.y, this.p2.x - this.p1.x, this.p2.y - this.p1.y);
	}

	_Rectangle.prototype.onMouseDown = function(e, ctx) {
		this.p1 = this.p2 = {x: e.offsetX, y : e.offsetY };
		this.stroke_color = Sketcher.color.foreground.getRGBa();
		this.fill_color = Sketcher.color.background.getRGBa();
	}

	_Rectangle.prototype.onMouseMove = function(e, ctx) {
		this.p2 =  {x: e.offsetX, y : e.offsetY};
		if(e.ctrlKey) {
			var dist = Math.min(this.p2.x-this.p1.x, this.p2.y-this.p1.y);
			this.p2 = {x: this.p1.x+dist, y:this.p1.y+dist};
		}
		this.draw(ctx);
	}

	_Rectangle.prototype.onMouseUp = function(e, ctx) {
		if(Math.abs(this.p1.x-this.p2.x) > 0 || Math.abs(this.p1.y-this.p2.y) > 0) {
			return '{"type": "Rectangle", "data": ' + JSON.stringify(this) + '}';
		}

		return null;
	}

	/*
	*	Class Pencil extends _Tool
	*/
	_Pencil = function() {
		_Tool.call(this);

		this.p0 = {
			x: 0,
			y: 0
		};
		this.points = {
			x: [],
			y: []
		};
		this.icon = 'pencil';
		this.options = {
			thickness: 1
		};
	}

	_Pencil.prototype = Object.create(_Tool.prototype);
	_Pencil.prototype.constructor = _Pencil;

	_Pencil.prototype.draw = function(ctx) {
		this.config_context(ctx);

		ctx.lineWidth = this.options.thickness;
		ctx.strokeStyle = this.stroke_color;
		ctx.beginPath();
		ctx.moveTo(this.p0.x, this.p0.y);
		for(let i = 0; i < this.points.x.length; i++) {
				ctx.lineTo(this.points.x[i], this.points.y[i]);
		}
		ctx.stroke();
		ctx.closePath();

	}

	_Pencil.prototype.onMouseDown = function(e, ctx) {
		this.p0 = {
			x: e.offsetX,
			y: e.offsetY
		};

		this.points = {
			x: [],
			y: []
		};
		this.stroke_color = Sketcher.color.foreground.getRGBa();
		this.fill_color = Sketcher.color.background.getRGBa();
	}

	_Pencil.prototype.onMouseMove = function(e, ctx) {
		this.points.x.push(e.offsetX);
		this.points.y.push(e.offsetY);
		this.config_context(ctx);
		this.draw(ctx);
	}

	_Pencil.prototype.onMouseUp = function(e, ctx) {
		this.points.x.push(e.offsetX);
		this.points.y.push(e.offsetY);

		if(this.points.x.length > 2)
			return '{ "type": "Pencil", "data": ' + JSON.stringify(this) + '}';
	}

	/*
	*	Class Circle extends _Tool
	*/
	_Circle = function() {
		_Tool.call(this);

		this.icon = 'circle';
		this.options = {
			thickness: 1,
			fill: false,
			stroke: true,
		}
	}

	_Circle.prototype = Object.create(_Tool.prototype);
	_Circle.prototype.constructor = _Circle;

	_Circle.prototype.draw = function(ctx) {
		this.config_context(ctx);

		ctx.lineWidth = this.options.thickness;
		ctx.fillStyle = this.fill_color;
		ctx.strokeStyle = this.stroke_color;
		ctx.beginPath();
		ctx.arc(
			this.p1.x, this.p1.y,
			Math.sqrt( Math.pow(this.p2.x-this.p1.x, 2) + Math.pow(this.p2.y-this.p1.y,2) ), 0,
			2*Math.PI
		);
		if (this.options.fill)
			ctx.fill();
		if (this.options.stroke)
			ctx.stroke();
	}

	_Circle.prototype.onMouseDown = function(e, ctx) {
		this.p1 = {
			x: e.offsetX,
			y: e.offsetY
		};

		this.stroke_color = Sketcher.color.foreground.getRGBa();
		this.fill_color = Sketcher.color.background.getRGBa();
	}

	_Circle.prototype.onMouseMove = function(e, ctx) {
		this.p2 = {
			x: e.offsetX,
			y: e.offsetY
		};

		this.draw(ctx);
	}

	_Circle.prototype.onMouseUp = function(e, ctx) {
		this.p2 = {
			x: e.offsetX,
			y: e.offsetY
		};

		return '{"type": "Circle", "data": ' + JSON.stringify(this) + '}';
	}


	/*
	*	Class PaintBucket extends _Tool
	*	//!\ Not working in online mode (for the moment ...)
	*/
	_PaintBucket = function( width, height) {
		_Tool.call(this);

		this.width = width;
		this.height = height;
		this.precision = 2550 * 0.2;
	}

    _PaintBucket.prototype = Object.create(_Tool.prototype);
	_PaintBucket.prototype.constructor = _PaintBucket;

	_PaintBucket.prototype.precision = function(precision) {
		if (typeof precision === 'number')
			if (precision < 0)
				console.error('La precision doit être un chiffre positif');
			else if (precision > 1)
				console.error('La precision doit être comprise entre 0 et 1');
			else
				this.precision = 2550 * number;

		return this.precision;

	}

	_PaintBucket.prototype.posOk = function(pos) {
		return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
	}


	_PaintBucket.prototype.getPosInData = function(pos) {
		return (pos.y * this.width + pos.x) * 4;
	}

	_PaintBucket.prototype.isTargetColor = function(pos, img, targetColor) {
		pos_data = this.getPosInData(pos);
		if (!this.posOk(pos)) {
			return false;
		}

		var diff = 3 * Math.abs(img.data[pos_data] - targetColor.r) + 4 * Math.abs(img.data[pos_data+1] - targetColor.g) + 3 * Math.abs(img.data[pos_data+2] - targetColor.b);

		var already_colored = img.data[pos_data] -  Sketcher.color.background.r + img.data[pos_data+1] - Sketcher.color.background.g + img.data[pos_data+2] - Sketcher.color.background.b ;

		if(already_colored == 0)
			return false;
		else if(diff < this.precision)
			return true;
		else
			return false;
	}


	_PaintBucket.prototype.draw = function(ctx) {
		var img = ctx.getImageData(0, 0, this.width, this.height);
		var pixel =  this.getPosInData(this.p);
		var targetColor = {
			r: img.data[pixel],
			g: img.data[pixel +1],
			b: img.data[pixel +2],
			a: img.data[pixel +3]
		};

		var P = [];
		P.push(this.p);

		while(P.length) {
			n = P.pop();

			if(this.isTargetColor(n, img, targetColor)) {

				// On check west
				var w = {
					x: n.x-1,
					y: n.y
				};

				while(this.isTargetColor(w,img, targetColor))
					w.x--;

				// On check east
				var e = {'x': n.x+1, 'y':n.y};
				while(this.isTargetColor(e,img, targetColor) )
					e.x++;

				for (let pix = w; pix.x < e.x; pix.x++){
					let pos_data = this.getPosInData(pix);
					img.data[pos_data] = Sketcher.color.background.r;
					img.data[pos_data +1] = Sketcher.color.background.g;
					img.data[pos_data +2] = Sketcher.color.background.b;
					img.data[pos_data +3] = Sketcher.color.background.a;

					var south = {
						x: pix.x,
						y: pix.y - 1
					};

					if(this.isTargetColor(south, img, targetColor))
						P.push(south);
					var north = {
						x: pix.x,
						y: pix.y + 1
					};

					if(this.isTargetColor(north, img, targetColor))
						P.push(north);
				}
			}
		}
		ctx.putImageData(img, 0,0);
	}

	_PaintBucket.prototype.onMouseDown = function(e, ctx) {

	}

	_PaintBucket.prototype.onMouseMove = function(e, ctx) {

	}

	_PaintBucket.prototype.onMouseUp = function(e, ctx) {
		this.p = {
			x: e.offsetX,
			y: e.offsetY
		};

		this.config_context(ctx);
		this.draw(ctx);

		return '{ "type": "PaintBucket", "data": ' + JSON.stringify(this) + '}';
	}


	/*
	*	Class Text extends _Tool
	*/
	_Text = function() {
		_Tool.call(this);

		this.icon = 'font';
		this.font = 'Linux Libertine'; // Helvetica, Courier New, Georgia
		this.bold = false;
		this.italic = false;

		this.options = {
			text: 'Text',
			fill: true,
			stroke: false,
			size: 150
		};
	}

	_Text.prototype = Object.create(_Tool.prototype);
	_Text.prototype.constructor = _Text;

	_Text.prototype.font = function(font) {
		if (typeof font === 'string')
			this.font = font;

		return this.font;
	}

	_Text.prototype.bold = function(bold) {
		if (typeof bold === 'boolean')
			this.bold = bold;

		return this.bold;
	}

	_Text.prototype.italic = function(italic) {
		if (typeof italic === 'boolean')
			this.italic = italic;

		return this.italic;
	}

	_Text.prototype.draw = function(ctx) {
		this.config_context(ctx);

		ctx.fillStyle = this.fill_color;
		ctx.strokeStyle = this.stroke_color;
		ctx.font = 'normal normal '+this.options.size+'px "'+this.font+'"';

		if(this.options.stroke)
			ctx.strokeText(this.options.text, this.p.x, this.p.y);
		if(this.options.fill)
			ctx.fillText(this.options.text, this.p.x, this.p.y);
	}

	_Text.prototype.onMouseDown = function(e, ctx) {
	}

	_Text.prototype.onMouseMove = function(e, ctx) {
	}

	_Text.prototype.onMouseUp = function(e, ctx) {
		this.p = {
			x: e.offsetX,
			y: e.offsetY
		};

		this.fill_color = Sketcher.color.background.getRGBA();
		this.stroke_color = Sketcher.color.foreground.getRGBA();

		this.draw(ctx);

		return '{ "type": "Text", "data": ' + JSON.stringify(this) + '}';
	}


	/* Function factory
	* Allows to parse JSON to _Tool
	*/
	function factory(json_str, ctx) {

		rawObject = JSON.parse(json_str, ctx);

		if (rawObject.type === "Line")
			c = _Line;
		else if (rawObject.type === "Rectangle")
			c = _Rectangle;
		else if (rawObject.type === "Pencil")
			c = _Pencil;
		else if (rawObject.type === "Circle")
			c = _Circle;
		else if (rawObject.type === "Text")
			c = this.Text;

		obj = cast(rawObject.data, c)
		obj.draw(ctx);
	};

	function cast(rawObj, constructor)
	{
		var obj = new constructor();
		for(var i in rawObj)
			obj[i] = rawObj[i];
		return obj;
	}



	return {
		Line: _Line,
		Rectangle: _Rectangle,
		Pencil: _Pencil,
		Circle: _Circle,
		Text: _Text,
		// PaintBucket: _PaintBucket,

		fromJSON: factory
	}

}());


Sketcher.Tools = (function() {
	this.tools = {
		Pencil: new Sketcher.ToolsAbstract.Pencil(),
		Line: new Sketcher.ToolsAbstract.Line(),
		Rectangle: new Sketcher.ToolsAbstract.Rectangle(),
		Circle: new Sketcher.ToolsAbstract.Circle(),
		Text: new Sketcher.ToolsAbstract.Text(),
		//  PaintBucket: new Sketcher.ToolsAbstract.PaintBucket(width, height),
	}

	this.current = 'Pencil';

 	function getCurrentTool() {
		return tools[current];
	}

	function setCurrentTool(name) {
		if(name in tools) {
				current = name;
		} else {
			console.error(name+' is not a tool');
		}
	}

	function fromJSON(json, ctx) {
		Sketcher.ToolsAbstract.fromJSON(json, ctx);
	}

	return {
		getTool: getCurrentTool,
		setTool: setCurrentTool,
		drawFromJSON: fromJSON,
		toolsList: tools
	}
})();
