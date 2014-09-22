
	var view = function(){


	}

		//this functoin get continer and some id that is in the cointer
		//the function return the element that have the same id
		view.prototype.findElementInObj = function(continer,id){
			var res;
			for (var i = 0; i < continer.length; i++) {
				if(continer[i].id === id){
					res = continer[i];
				}
			};
			return res;		
		}
		//this function check if the the input is valid
		view.prototype.validData = function(str){

			if(typeof str === undefined ||  typeof str === null){return false;}

			if(str.length !== 8){
				return false;
			}
			if(str.search(/[0-9][0-9]:[0-5][0-9]:[0-5][0-9]/g) === -1){
				return false;
			}
			return true;
		}
	var AlarmClockView = function(idSelector){

		var updateButtonEl,textBoxEl,buttonEl,el,element,idObj,stopAlarm,setButtonEl,AlarmClockObj;

		function init(){
			this.element = document.getElementById(idSelector);
			this.idObj = this.element.querySelectorAll("*")
			this.stopAlarm = this.findElementInObj(this.idObj,"currentTimeButton"); 
			this.setButtonEl = this.findElementInObj(this.idObj,"clockButton");
			this.textBoxEl = this.findElementInObj(this.idObj,"clock_texbox");
			this.el = this.findElementInObj(this.idObj,"clock");

		}
		init.call(this);


		
//===========================
//===========================

		var timeUpdate = function(){
			// self.updateTimeOnHtml(self.AlarmClockObj.getTime());
			this.updateTimeOnHtml(this.AlarmClockObj.getTime());
		}
		var alarmToggle = function(){
			this.toggaleAlarm();	
		}

		var callBackObj = { 'alarmToggle':alarmToggle,'timeUpdate':timeUpdate,'context':this}

//===========================
//===========================
		this.AlarmClockObj = new AlarmClock(callBackObj);


		//event liseten
		function bindEvents(){
			var that = this;
			that.setButtonEl.onclick = function(){
				that.setButtonClick();
			}
			that.stopAlarm.onclick = function(){
				that.stopAlarmFun();
			}	
			document.addEventListener("timeUnitPass", function(e) {
				// that.updateTimeOnHtml(that.AlarmClockObj.getTime());
			});
			document.addEventListener("alarmChange", function(e) {
				if(e.detail.id === "Clock"){
					// that.toggaleAlarm();	
				}
			});
		}
		bindEvents.call(this);
	}


	AlarmClockView.prototype = new view();

	AlarmClockView.prototype.validData = function(str){
		if(typeof str === undefined ||  typeof str === null){return false;}
		if(str.search(/[0-2][0-9]:[0-5][0-9]:[0-5][0-9]/g) === -1 || (str[0]==="2" && str[1]>"4")){
			return false;
		}else{
			return true;
		}
	}

	AlarmClockView.prototype.setButtonClick = function(){
		var val = (this.textBoxEl && this.textBoxEl.value);
		if(!this.validData(val)){
			alert("invalid data, the input should be \"hh:mm:ss\"");
			this.textBoxEl.value = "";
			return;
		};
		this.AlarmClockObj.setAlarmTime(val);
	}

	AlarmClockView.prototype.stopAlarmFun = function(){
		displayAlarm = false;
		this.AlarmClockObj.setDisplayAlaram(false);
		this.element.className = this.element.className.replace("alarm","");
	}

	AlarmClockView.prototype.updateTimeOnHtml = function(input){
		this.el.innerHTML = input || this.AlarmClockObj.getTime();
	}
	
	AlarmClockView.prototype.toggaleAlarm = function(){
		// debugger;
		if(this.element.className.indexOf("alarm") === -1){
			this.element.className += ' alarm';
			console.log(this.element.className);
		}else{
			this.element.className = this.element.className.replace("alarm","");
			console.log(this.element.className);
		}
	}


	var StopperView = function(idSelector){

		var defaultTime = "00:00:00";
		var that = this;
		var buttonEl,stopperBoxEl,el,idObj,element,stopButton,lapButton;

		element = document.getElementById(idSelector);
		idObj = element.querySelectorAll("*")
		buttonEl = this.findElementInObj(idObj,"stopperButton"); 
		textBoxEl = this.findElementInObj(idObj,"stopper_texbox");
		el = this.findElementInObj(idObj,"stopper");
		stopButton = this.findElementInObj(idObj,"stopStopperButton");
		lapButton = this.findElementInObj(idObj,"lapStopperButton");
		contButton = this.findElementInObj(idObj,"continueStopperButton");

		// Stopper.prototype = new Clock();
		var timeUpdate = function(){
			this.updateTimeOnHtml();
		}
		

		var callBackObj = { 'timeUpdate':timeUpdate,'context':this}

		var StopperObj = new Stopper(callBackObj);
		el.innerHTML = defaultTime;

		this.updateTimeOnHtml = function(){
			el.innerHTML = StopperObj.getTime() || el.innerHTML;
		}
		//event liseten
		function bindEvents(){
			var that = this;
			document.addEventListener("timeUnitPass", function(e) {
				if(e.detail.id === "Stopper"){
					that.updateTimeOnHtml();
				}
			});
			lapButton.onclick = function(){
				StopperObj.setUpdateStopper(true);
				that.updateTimeOnHtml(el.innerHTML);
				StopperObj.setUpdateStopper(false);
			}
			//start button
			buttonEl.onclick = function(){
				StopperObj.stopperStart();
				this.disabled = true;
				lapButton.disabled = false;
				contButton.disabled = false;
			}
			stopButton.onclick = function(){
				//clear stopper intrval

				StopperObj.stopRun();
				//update the html with the stop time
				StopperObj.setUpdateStopper(true);
				StopperObj.zero();

				that.updateTimeOnHtml()

				//disable and enable relevnt button
				buttonEl.disabled = false;
				lapButton.disabled = true;
				contButton.disabled = true;
			}

			//continue button;
			contButton.onclick = function() {
				StopperObj.setUpdateStopper(true);
			}

		}
		bindEvents.call(this);



	}
	var TimerView = function(idSelector){
		var defaultTime = "00:15:00";
		// var that = this;
		var buttonEl,stopperBoxEl,el,idObj,element,textBoxEl,showUpdate = false;
		// this.alarmTime = "00:00:00";
		//==================================================
		//get the elment form the dom start
		//==================================================

		element   = document.getElementById(idSelector);
		idObj     = element.querySelectorAll("*")
		buttonEl  = this.findElementInObj(idObj,"setTimerButton"); 
		textBoxEl = this.findElementInObj(idObj,"timer_texbox");
		el        = this.findElementInObj(idObj,"timer");
		startButton  = this.findElementInObj(idObj,"startTimerButton");
		stopAlarmButton  = this.findElementInObj(idObj,"stopAlarmButton");


//===========================
//===========================

		var timeUpdate = function(){
			// self.updateTimeOnHtml(self.AlarmClockObj.getTime());
			this.updateTimeOnHtml();
		}
		var alarmToggle = function(){
			this.toggaleAlarm();	
		}

		var callBackObj = { 'alarmToggle':alarmToggle,'timeUpdate':timeUpdate,'context':this}

//===========================
//===========================
		var TimerObj = new Timer(callBackObj);
		TimerObj.setTime(defaultTime);
		el.innerHTML = TimerObj.startTime;



		this.toggaleAlarm = function(){
			// debugger;
			if(element.className.indexOf("alarm") === -1){
				element.className += ' alarm';
				console.log(element.className);
			}else{
				element.className = element.className.replace("alarm","");
				console.log(element.className);
			}
		}
		this.updateTimeOnHtml = function(){
			el.innerHTML = TimerObj.getTime() || TimerObj.clockTime;
		}

		function bindEvents(){
			var that = this;
			document.addEventListener("timeUnitPass", function(e) {
				if(e.detail.id === "Timer"){
					that.updateTimeOnHtml();
				}
			});
			document.addEventListener("alarmChange", function(e) {
				if(e.detail.id === "Timer"){
					that.toggaleAlarm();
				}
			});

			buttonEl.onclick = function(){
				TimerObj.startValue = textBoxEl.value;
				if(!that.validData(TimerObj.startValue)){
					alert("invalid data, the input should be \"hh:mm:ss\"");
					return 
				};
				TimerObj.setTime(TimerObj.startValue);
				el.innerHTML =  textBoxEl.value;
				textBoxEl.value = "";
				startButton.disabled = false;
				clearInterval(TimerObj.intervalId);
			}

			startButton.onclick = function(){
				var val = TimerObj.startTime || defaultTime;
				this.disabled = true;
				TimerObj.setTime(val);
				TimerObj.runTime();	
			}
			stopAlarmButton.onclick = function(){
				TimerObj.stopRun();
				element.className = element.className.replace("alarm","");
				startButton.disabled = false;
				el.innerHTML = TimerObj.startTime;

			}
		}
		bindEvents.call(this);
	}

	// AlarmClockView.prototype = new view();
	var al = new AlarmClockView("clockContiner");
	al.updateTimeOnHtml();

	StopperView.prototype = new view();
	var st = new StopperView("stopperContiner");

	TimerView.prototype = new view();
	var timer1 = new TimerView("timerContiner");













	