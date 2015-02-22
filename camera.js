/*	Author: 	Eleanor Durrant
	Version: 	1.1
	Date:		15th February 2015
	Files:		index.html, camera.css, camera.js
	This script visualises the workings of a camera. It is intended to help the photography student get their head around the relationship between aperture and shutter settings, and the meaning of the seemingly arbitrary "f-stop" designations.
	The buttons and their text are in the Scalable Vector Graphic, and calls this script. In this version, the text is in the SVG rather than being written from the values in the array, even though it duplicates those values. It must be updated there seperately.
	In this version, the camera is in manual mode, and only has this mode. An initial test version had a combined aperture-priority and shutter-priority mode, keeping exposure value constant, but this is less useful for learning. A better implementation of that, with a mode switcher, is now reserved for a future version.
	*/
var camera = {
	ISO: "400",
	ISOs: ["200","400","800"],
	focalLength:50,
	fStop: 5.6,
	fStops:[2,2.8,4,5.6,8,11,16],
	shutter: "1/125",
	shutterValues: ["1/15","1/30","1/60","1/125","1/250","1/500","1/1000"],
	setDefaults: function(){
		this.ISO = this.ISOs[Math.floor(this.ISOs.length/2)];
		this.fStop = this.fStops[Math.floor(this.fStops.length/2)];
		this.shutter = this.shutterValues[Math.floor(this.shutterValues.length/2)];
		this.display();
	},
	setFStop: function(f){
		this.fStop = parseFloat(f);
		this.display();
	},
	stopDown: function(){
		var s = this.fStops.indexOf(this.fStop);
		if (s+1 < this.fStops.length){
			this.setFStop(this.fStops[s+1]);
		}
	},
	stopUp: function(){
		var s = this.fStops.indexOf(this.fStop);
		if(s > 0){
			this.setFStop(this.fStops[s-1]);
		}
	},
	setTime: function(t){
		this.shutter = t;
		var iT = this.shutterValues.indexOf(t);
			this.display();
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
		this.display();
	},
	display: function(){
		var di;
		//  Calculate resulting exposure value
		var fStopIndex = this.fStops.indexOf(this.fStop);
		var shutterIndex = this.shutterValues.indexOf(this.shutter);
		var fLightIndex = (this.fStops.length-1-fStopIndex);
		var isoOffset = this.ISOs.indexOf(this.ISO)-1; // used for exposure calculation
		var exposureValue = fLightIndex - shutterIndex + isoOffset;
		var exposureVis = document.getElementById("exposureVis");
		if(exposureValue < 0){
			exposureVis.style.fill="black";
			exposureVis.style.opacity=((0-exposureValue)+4)/10; 
		}
		if(exposureValue == 0){
			exposureVis.style.fill="transparent";
		}
		if(exposureValue > 0){
			exposureVis.style.fill="white";
			exposureVis.style.opacity=((exposureValue+4)/10);
		}
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
		
		fHighlight = function(arrayClassName, indexToHighlight, lowColour, highColour){
			thingArray = document.getElementsByClassName(arrayClassName);
			var i;
			for (i=0; i < thingArray.length; i++){
					if (i == indexToHighlight){
						thingArray[i].style.fill = highColour;
					}else{
						thingArray[i].style.fill = lowColour;
					}
			}
		}
		fHighlight("apSetting",fStopIndex,"#ddd","yellow");
		fHighlight("shSetting",shutterIndex,"#ddd","yellow");
		fHighlight("isoSetting",this.ISOs.indexOf(this.ISO),"#ddd","yellow");
		fHighlight("areaVis",fStopIndex,"transparent","yellow");
		fHighlight("timeVis",shutterIndex,"transparent","yellow");
	}
};