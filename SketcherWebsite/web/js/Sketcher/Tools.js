Sketcher.ToolsAbstract = ( function() {

	/*
	*	Abstract Tools
	*/
	function _Tool() {
		this._stroke = true;
	}

	_Tool.prototype.stroke = function (stroke) {
		if (typeof stroke === 'boolean')
			this._stroke = stroke;

		return this._stroke;
	}

	// AbstractFunctions
	_Tool.prototype.onMouseDown;
	_Tool.prototype.onMouseMove;
	_Tool.prototype.onMouseUp;


	_Tool.prototype.config_context = function (ctx) {
		ctx.strokeStyle = this.stroke_color;
		ctx.lineWidth = Sketcher.Core.lineWidth;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	};


	/* Class Line extend _Tool
	*
	*
	*
	*/
	function Line() {
		_Tool.call(this)
		this.p1;
		this.p2;
	}

	Line.prototype = Object.create(_Tool.prototype);
	Line.prototype.constructor = Line;

	Line.prototype.draw = function (ctx) {
		this.config_context(ctx);

		ctx.beginPath();
		ctx.moveTo(this.p1.x, this.p1.y);
		ctx.lineTo(this.p2.x,this.p2.y);
		ctx.closePath();
		ctx.stroke();
	}

	Line.prototype.onMouseDown = function (e) {
		this.p1 = {x : e.offsetX, y : e.offsetY };
		this.line_width = Sketcher.Core.lineWidth;
		this.stroke_color = Sketcher.color.foreground.getRGBa();
		this.fill_color = Sketcher.color.background.getRGBa();
	}

	Line.prototype.onMouseMove = function (e, ctx) {
		this.p2 =  {x : e.offsetX, y : e.offsetY};
		this.draw(ctx);
	}

	Line.prototype.onMouseUp = function (e, ctx) {
		this.p2 = { x :e.offsetX, y : e.offsetY};

		return '{ "type":"Line","data":' + JSON.stringify(this) + '}';
	}


	/* Class Rect extends _Tool
		*
		*
		*
		*/
	function Rect() {
		_Tool.call(this);
		this._fill = false;
	}

	Rect.prototype = Object.create(_Tool.prototype);
	Rect.prototype.constructor = Rect;

	Rect.prototype.fill = function (fill) {
		if (typeof fill === 'boolean')
			this._fill = fill;

		return this._fill;
	}

	Rect.prototype.draw = function (ctx) {
		this.config_context(ctx);
		ctx.fillStyle = this.fill_color;
		if(this._fill)
			ctx.fillRect(this.p1.x, this.p1.y, this.p2.x - this.p1.x, this.p2.y - this.p1.y);
		if (this._stroke)
			ctx.strokeRect(this.p1.x, this.p1.y, this.p2.x - this.p1.x, this.p2.y - this.p1.y);

	}

	Rect.prototype.onMouseDown = function (e, ctx) {
		this.p1 = this.p2 = {x : e.offsetX, y : e.offsetY };
		this.line_width = Sketcher.Core.lineWidth;
		this.stroke_color = Sketcher.color.foreground.getRGBa();
		this.fill_color = Sketcher.color.background.getRGBa();
	}

	Rect.prototype.onMouseMove = function (e, ctx) {
		this.p2 =  {x : e.offsetX, y : e.offsetY};
		if(e.ctrlKey) {
			var dist = Math.min(this.p2.x-this.p1.x, this.p2.y-this.p1.y);
			this.p2 = {x:this.p1.x+dist, y:this.p1.y+dist};
		}
		this.draw(ctx);
	}

	Rect.prototype.onMouseUp = function (e, ctx) {
		if(Math.abs(this.p1.x-this.p2.x) > 0 || Math.abs(this.p1.y-this.p2.y) > 0) {
			return '{ "type":"Rect","data":' + JSON.stringify(this) + '}';
		}

		return null;
	}

	/* Class Pencil extends _Tool
	*
	*
	*
	*/
	function Pencil() {
		_Tool.call(this);
		this.p0;
		this.points = [];
	}

	Pencil.prototype = Object.create(_Tool.prototype);
	Pencil.prototype.constructor = Pencil;

	Pencil.prototype.draw = function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.p0.x, this.p0.y);
		for (var point of this.points) {
				ctx.lineTo(point.x, point.y);
		}
		ctx.stroke();
		ctx.closePath();

	}

	Pencil.prototype.onMouseDown = function (e, ctx) {
		this.p0 =  {x : e.offsetX, y : e.offsetY };
		this.points = [];
		this.line_width = Sketcher.Core.lineWidth;
		this.stroke_color = Sketcher.color.foreground.getRGBa();
		this.fill_color = Sketcher.color.background.getRGBa();
	}

	Pencil.prototype.onMouseMove = function (e, ctx) {
		this.points.push ( {x : e.offsetX, y : e.offsetY } );
		this.config_context(ctx);
		this.draw(ctx);
	}

	Pencil.prototype.onMouseUp = function (e, ctx) {
		this.points.push ( {x : e.offsetX, y : e.offsetY } );
		return '{ "type":"Pencil","data":' + JSON.stringify(this) + '}';
	}

	/* Class Circle extends _Tool
	*
	*
	*
	*/
	function Circle() {
		_Tool.call(this);
		this._fill = false;
	}

	Circle.prototype = Object.create(_Tool.prototype);
	Circle.prototype.constructor = Circle;

	Circle.prototype.fill = function (fill) {

		if (typeof fill === 'boolean')
			this._fill = fill;

		return this._fill;
	}

	Circle.prototype.draw = function (ctx) {
		this.config_context(ctx);

		ctx.fillStyle = Sketcher.color.background.getRGBA();
		ctx.beginPath();
		ctx.arc(this.p1.x,this.p1.y,Math.sqrt( Math.pow(this.p2.x-this.p1.x, 2) + Math.pow(this.p2.y-this.p1.y,2) ),0, 2*Math.PI);
		if (this._fill)
			ctx.fill();
		if (this._stroke)
			ctx.stroke();

	}

	Circle.prototype.onMouseDown = function (e, ctx) {
		this.p1 = {x : e.offsetX, y : e.offsetY };
		this.line_width = Sketcher.Core.lineWidth;
		this.stroke_color = Sketcher.color.foreground.getRGBa();
		this.fill_color = Sketcher.color.background.getRGBa();
	}

	Circle.prototype.onMouseMove = function (e, ctx) {
		this.p2 =  {x : e.offsetX, y : e.offsetY};
		this.draw(ctx);
	}

	Circle.prototype.onMouseUp = function (e, ctx) {
		this.p2 = { x :e.offsetX, y : e.offsetY};

		return '{ "type":"Circle","data":' + JSON.stringify(this) + '}';
	}


	/* Class Paint Bucket extends _Tool
	*
	*
	*
	*/
	function PaintBucket( width, height) {
		_Tool.call(this);
		this.width = width;
		this.height = height;
		this.precision = 2550 * 0.2;
	}

    PaintBucket.prototype = Object.create(_Tool.prototype);
	PaintBucket.prototype.constructor = PaintBucket;

	PaintBucket.prototype.precision = function(precision) {
		if (typeof precision === 'number')
			if (precision < 0)
				console.error('La precision doit être un chiffre positif');
			else if (precision > 1)
				console.error('La precision doit être comprise entre 0 et 1');
			else
				this.precision = 2550 * number;

		return this.precision;

	}

	PaintBucket.prototype.posOk = function(pos) {
		return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
	}


	PaintBucket.prototype.getPosInData = function(pos) {
		return (pos.y * this.width + pos.x) * 4;
	}

	PaintBucket.prototype.isTargetColor = function(pos, img, targetColor) {
		pos_data = this.getPosInData(pos);
		if (!this.posOk(pos)) {
			return false;
		}

		var diff = 3 * Math.abs(img.data[pos_data] - targetColor.r) + 4 * Math.abs(img.data[pos_data+1] - targetColor.g) + 3 * Math.abs(img.data[pos_data+2] - targetColor.b);

		var already_colored = img.data[pos_data] -  Sketcher.color.background.r + img.data[pos_data+1] - Sketcher.color.background.g + img.data[pos_data+2] - Sketcher.color.background.b ;

		if (already_colored == 0) {
			return false;
		}else if(diff < this.precision) {
			//alert('ok')
			return true;

		}else {
			//alert('nope')
			return false;
		}

	}


	PaintBucket.prototype.draw = function (ctx) {
		var img = ctx.getImageData(0, 0, this.width, this.height);
		var pixel =  this.getPosInData(this.p);
		var targetColor = {r : img.data[pixel], g : img.data[pixel +1 ], b : img.data[pixel +2],a: img.data[pixel + 3]};

		var P = [];
		P.push(this.p);

		while (P.length) {
			n = P.pop();

			if( this.isTargetColor(n, img, targetColor) ) {

				//On check ouest
				var w = {'x' : n.x-1, 'y':n.y};
				while(this.isTargetColor(w,img,targetColor))
					w.x--;

				//On check est
				var e = {'x' : n.x+1, 'y':n.y};
				while(this.isTargetColor(e,img,targetColor) )
					e.x++;


				for (let pix = w; pix.x < e.x; pix.x++){
					let pos_data = this.getPosInData(pix);
					img.data[pos_data] = Sketcher.color.background.r;
					img.data[pos_data +1] = Sketcher.color.background.g;
					img.data[pos_data +2] = Sketcher.color.background.b;
					img.data[pos_data +3] = Sketcher.color.background.a;

					var south = {x : pix.x , y : pix.y - 1};
					if (this.isTargetColor(south, img, targetColor))
						P.push(south);
					var north = {x : pix.x , y : pix.y + 1};
					if (this.isTargetColor(north, img, targetColor))
						P.push(north);

				}
			}
		}
		ctx.putImageData(img, 0,0);
	}

	PaintBucket.prototype.onMouseDown = function (e, ctx) {

	}

	PaintBucket.prototype.onMouseMove = function (e, ctx) {

	}

	PaintBucket.prototype.onMouseUp = function (e, ctx) {
		this.p = { x :e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);

		return '{ "type":"PaintBucket","data":' + JSON.stringify(this) + '}';
	}


	/* Class Text extends _Tool
	*
	*
	*
	*/
	function Text() {
		_Tool.call(this);
		this._fill = false;
		this.text = 'caca';
		this.font = 'Calibri';
		this.size = '50px';
		this.bold = false;
		this.italic = false;

		this.stroke(true);
		this.fill(true);
	}

	Text.prototype = Object.create(_Tool.prototype);
	Text.prototype.constructor = Text;

	Text.prototype.fill = function (fill) {
		if (typeof fill === 'boolean')
			this._fill = fill;

		return this._fill;
	}

	Text.prototype.font = function(font) {
		if (typeof font === 'string')
			this.font = font;

		return this.font;
	}

	Text.prototype.size = function(size) {
		if (typeof size === 'string')
			this.size = size;

		return this.size;
	}

	Text.prototype.bold = function(bold) {
		if (typeof bold === 'boolean')
			this.bold = bold;

		return this.bold;
	}

	Text.prototype.italic = function(italic) {
		if (typeof italic === 'boolean')
			this.italic = italic;

		return this.italic;
	}

	Text.prototype.text = function(text) {
		if (typeof text === 'string')
			this.text = text;

		return this.text;

	}


	Text.prototype.draw = function (ctx) {

		ctx.fillStyle = Sketcher.color.background.getRGBA();
		ctx.font = (this.bold ? 'bold ' : '') + (this.italic ? 'italic ' : '') + this.size + ' ' + this.font;

		if (this._fill)
			ctx.fillText(this.text,this.p.x,this.p.y);


		if (this._stroke)
			ctx.strokeText(this.text,this.p.x,this.p.y);

	}

	Text.prototype.onMouseDown = function (e, ctx) {
	}

	Text.prototype.onMouseMove = function (e, ctx) {
	}

	Text.prototype.onMouseUp = function (e, ctx) {
		this.p = { x :e.offsetX, y : e.offsetY};
		this.config_context(ctx);
		this.draw(ctx);

		return '{ "type":"Text","data":' + JSON.stringify(this) + '}';
	}


	/* Function factory
	* Allow to parse JSON to _Tool
	*/
	function factory(json_str, ctx) {

		rawObject = JSON.parse(json_str, ctx);

		if (rawObject.type === "Line")
			c = Line;
		else if (rawObject.type === "Rect")
			c = Rect;
		else if (rawObject.type === "Pencil")
			c = Pencil;
		else if (rawObject.type === "Circle")
			c = Circle;

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
		line : Line,
		rectangle : Rect,
		pencil : Pencil,
		circle : Circle,
		paint_bucket : PaintBucket,
		text : Text,

		fromJSON : factory
	}

}());


Sketcher.Tools = (function() {

	var tools;
	var current;


	function initialization(width, height) {
	tools = {
					 'line' : new Sketcher.ToolsAbstract.line(),
					 'rectangle' : new Sketcher.ToolsAbstract.rectangle(),
					 'pencil' : new Sketcher.ToolsAbstract.pencil(),
					 'circle' : new Sketcher.ToolsAbstract.circle(),
					 'paint_bucket' : new Sketcher.ToolsAbstract.paint_bucket(width, height),
					 'text' : new Sketcher.ToolsAbstract.text()
		}

		current = 'rectangle';

	}


  function getCurrentTool() {
		return tools[current];
	}


	function setCurrentTool(name) {
		if ( name in tools) {
				current = name;
		} else {
			console.error(name+' is not a tool');
		}


	}

	function fromJSON(json, ctx) {
		Sketcher.ToolsAbstract.fromJSON(json, ctx);
	}



	return {
		init : initialization,
		getTool : getCurrentTool,
		setTool : setCurrentTool,
		drawFromJSON : fromJSON
	}

}());