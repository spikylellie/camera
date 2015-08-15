/*	Author: 	Eleanor Durrant
	Version: 	2.1
	Files:		index.html, camera.css, camera.js
	This script works with an SVG diagram to visualise the workings of a camera. It is intended to help the photography student get their head around the relationship between aperture and shutter settings, and the meaning of the seemingly arbitrary "f-stop" numbers.
	The buttons and their text are in the Scalable Vector Graphic. The values have been selected as possibly relatable to an existing camera in some imaginary light conditions. They are displayed on the buttons and specified at the top of this script. They would have to be changed in both; but their presence in the SVG itself makes the SVG much easier to understand.
	Version 2.0: Added aperture-priority and shutter-priority modes, better flow control, use CSS classes for highlighting. 
	Version 2.1: Greyed out controls as necessary according to Mode. Clarified use of colour. Better text style and labels. Made whole thing bigger and rearranged controls. */
var camera = {
	ISO: "400",
	ISOs: ["200","400","800"],
	isoOffset: 0,
	focalLength:50,
	fStop: 5.6,
	fStopIndex: 3,
	fStops: [2,2.8,4,5.6,8,11,16],
	mode: "M",
	modes: ["S","M","A"],
	shutter: "1/125",
	shutterIndex: 3,
	shutterValues: ["1/15","1/30","1/60","1/125","1/250","1/500","1/1000"],
	setDefaults: function(){
		this.setISO(this.ISOs[Math.floor(this.ISOs.length/2)]);
		this.setFStop(this.fStops[Math.floor(this.fStops.length/2)]);
		this.setTime(this.shutterValues[Math.floor(this.shutterValues.length/2)]);
		this.setMode(this.modes[Math.floor(this.modes.length/2)]);
	},
	setFStop: function(f){
		this.fStop = parseFloat(f);
		this.fStopIndex = this.fStops.indexOf(this.fStop);
	},
	fStopClose: function(){
		var s = this.fStopIndex;
		if (s+1 < this.fStops.length){
			this.setFStop(this.fStops[s+1]);
		}
	},
	fStopOpen: function(){
		var s = this.fStopIndex;
		if(s > 0){
			this.setFStop(this.fStops[s-1]);
		}
	},
	setTime: function(t){
		this.shutter = t;
		this.shutterIndex = this.shutterValues.indexOf(this.shutter);
	},
	shutterOpen: function(){
		var s = this.shutterValues.indexOf(this.shutter);
		if (s > 0){
			this.setTime(this.shutterValues[s-1]);
		}
	},
	shutterClose: function(){
		var s = this.shutterValues.indexOf(this.shutter);
		if (s+1 < this.shutterValues.length){
			this.setTime(this.shutterValues[s+1]);
		}
	},
	setISO: function(ISO){
		this.ISO = ISO;
		this.isoOffset = this.ISOs.indexOf(this.ISO)-Math.floor(this.ISOs.length/2);
	},
	setMode: function(x){
		if(x == "A" || x == "S"){
			this.mode = x;
		}else{
			this.mode = "M";
		}
	},
	display: function(){
		// highlight all the controls in use and their visualisations
		var fHighlight = function(arrayClassName, indexToHighlight, cssClassHi, cssClassLo){
			var thingArray = document.getElementsByClassName(arrayClassName);
			var i, oldClasses;
			var reHi = new RegExp("(?:^|\\s)"+cssClassHi+"(?!\\S)","g");
			var reLo = new RegExp("(?:^|\\s)"+cssClassLo+"(?!\\S)","g");
			for (i=0; i < thingArray.length; i++){
					oldClasses = thingArray[i].getAttribute("class");
					if (i == indexToHighlight){
						thingArray[i].setAttribute("class",oldClasses.replace(reLo, ' '+cssClassHi+' '));
					}else{
						thingArray[i].setAttribute("class",oldClasses.replace(reHi,' '+cssClassLo+' '));
					}
			}
		}
		fHighlight("apSetting",this.fStopIndex,"controlActive","control");
		fHighlight("shSetting",this.shutterIndex,"controlActive","control");
		fHighlight("isoSetting",this.ISOs.indexOf(this.ISO),"controlActive","control");
		fHighlight("areaVis",this.fStopIndex,"visActive","visInactive");
		fHighlight("timeVis",this.shutterIndex,"visActive","visInactive");
		fHighlight("modeSetting",this.modes.indexOf(this.mode),"controlActive","control");
		
		//  If Mode disables a set of controls, grey them out by masking with an overlay
		var apControlOverlay = document.getElementById("apOverlay");
		var shControlOverlay = document.getElementById("shOverlay");
		switch (this.mode){
			case "A":
			apControlOverlay.setAttribute("style","display:none;");
			shControlOverlay.setAttribute("style","display:block;");
			break;
			case "S":
			apControlOverlay.setAttribute("style","display:block;");
			shControlOverlay.setAttribute("style","display:none;");
			break;
			default:
			apControlOverlay.setAttribute("style","display:none;");
			shControlOverlay.setAttribute("style","display:none;");
		}
		
		//  Calculate the exposure value and display under- or over-exposure
		var exposureValue = (this.fStops.length-1-this.fStopIndex) - this.shutterIndex + this.isoOffset;
		var exposureVis = document.getElementById("exposureVis");
		if(exposureValue < 0){
			exposureVis.style.fill="black";
			exposureVis.style.opacity=((0-exposureValue)+4)/10; 
			document.getElementById("photons").innerHTML = "Underexposed"
		}
		if(exposureValue == 0){
			exposureVis.style.fill="transparent";
			document.getElementById("photons").innerHTML = "Good exposure"
		}
		if(exposureValue > 0){
			exposureVis.style.fill="white";
			exposureVis.style.opacity=((exposureValue+4)/10);
			document.getElementById("photons").innerHTML = "Overexposed"
		}
		
		// calculate the radius of the aperture circle and display the aperture visualisations
		var diameter = this.focalLength / this.fStop
		var radius = diameter / 2;
		document.getElementById("aperture").setAttribute("r",radius+"mm");
		document.getElementById("focalLengthVis").setAttribute("x2",this.focalLength+"mm");
		document.getElementById("diameterVis").setAttribute("x2",this.focalLength+"mm");
		document.getElementById("diameterVis").setAttribute("style","stroke-dasharray:"+(diameter-0.5)+"mm,0.5mm;");
		document.getElementById("focaltext").innerHTML = this.focalLength +"mm";
		document.getElementById("diametertext").innerHTML = Math.round(diameter) + " mm";
		document.getElementById("fstoptext").innerHTML = this.fStop;
		document.getElementById("aparea").innerHTML = Math.round(Math.PI*radius*radius);
		document.getElementById("timevalue").innerHTML = this.shutter;
	},
	set: function(action, value){	
		switch (action){
			case "fStop":
				this.setFStop(value);
				break;
			case "fStopOpen":
				this.fStopOpen();
				break;
			case "fStopClose":
				this.fStopClose();
				break;
			case "shutter":
				this.setTime(value);
				break;
			case "shutterOpen":
				this.shutterOpen();
				break;
			case "shutterClose":
				this.shutterClose();
				break;
			case "iso":
				this.setISO(value);
				break;
			case "mode":
				this.setMode(value);
				break;
			default:
				this.setDefaults();
		}
		switch (this.mode){
			case "A": 
				var maxShutterIndex = this.shutterValues.length - 1;
				var newShutterIndex = maxShutterIndex - this.fStopIndex + this.isoOffset;
				if (newShutterIndex < 0){
					newShutterIndex = 0;
				} else if (newShutterIndex > maxShutterIndex){
					newShutterIndex = maxShutterIndex;
				} 
				this.setTime(this.shutterValues[newShutterIndex]);
				break;
			case "S":
				var maxfStopIndex = this.fStops.length - 1;
				var newfStopIndex = maxfStopIndex - this.shutterIndex + this.isoOffset;
				if (newfStopIndex < 0){
					newfStopIndex = 0;
				} else if (newfStopIndex > maxfStopIndex){
					newfStopIndex = maxfStopIndex;
				}
				this.setFStop(this.fStops[newfStopIndex]);
				break;
		}
		this.display();
	}
		
};