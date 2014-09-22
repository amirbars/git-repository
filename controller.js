

//===================Alarm clock start===========
//===============================================	
	 var Clock = function(){

		//=============================
		//variable decelerations start
		//=============================		
		this.milliSecCounter = 0;//10 milliseconds === 1 milliSecCounter;
		this.secCounter = 0;//100 milliSecCounter === 1 milliSecCounter;
		this.minCounter = 0;//count the mintues
		this.hourCounter = 0;//count the hours
		this.intervalTime = 1000;
		this.alarmTime;
		//=============================
		//variable decelerations end
		//=============================

	};

	Clock.prototype.timeFormat = function(time){
		//the time should by only hour or minutes or seconds NOT 00:00:00
		if(time < 10){
			time = "0"+time;
		}
		return time;
	};
	Clock.prototype.runTime = function(){

			var self = this;
			var myEvent = new CustomEvent("timeUnitPass", {
				detail: {
					// milisec: self.milliSecCounter
					id:self.typeId
				}
			});
		
			self.intervalId = setInterval(function(){
				self.milliSecCounter++;
				if(self.milliSecCounter > 99){
					self.secCounter++;
					self.milliSecCounter = 0;
					if(self.secCounter > 59){
						self.minCounter++;
						self.secCounter = 0;
						if(self.minCounter > 59){
							self.hourCounter++;
							self.minCounter = 0;
						}
					}				
				}

				myEvent.detail.id = self.typeId;

				//=============================== 
				if(self.timeUpdate){
					self.timeUpdate.call(self.context);
				}
				//===============================

				// document.dispatchEvent(myEvent);
			},this.intervalTime);
		}


	var AlarmClock = function (i_obj){
		//=============================
		//variable decelerations start
		//=============================
		var updateButtonEl,textBoxEl,buttonEl,el,element,idObj;
		var displayAlarm = false;
		this.typeId = "Clock";
		this.timeUpdate = i_obj.timeUpdate;
		this.alarmFunction = i_obj.alarmToggle;
		this.context = i_obj.context;
		//=============================
		//variable decelerations end
		//=============================


		this.alramChange = new CustomEvent("alarmChange", {
			detail: {
				id:this.typeId
			}
		});
		this.runTime();

	};

	AlarmClock.prototype = new Clock();
	AlarmClock.prototype.getTime = function(){
		var m,h,s;
		this.date = new Date();
		h = this.timeFormat(this.date.getHours());
		m = this.timeFormat(this.date.getMinutes());
		s = this.timeFormat(this.date.getSeconds());
		var clockTime = h+":"+m+":"+s;

		if(this.alarmTime === clockTime){
			displayAlarm = true;
		}

		if(this.alarmTime <= clockTime && displayAlarm){
			// document.dispatchEvent(this.alramChange);
			if(this.alarmFunction){
				this.alarmFunction.call(this.context);
			}

		}
		return 	h+":"+m+":"+s;		
	}
	AlarmClock.prototype.setAlarmTime = function(input){
		this.alarmTime = input;
	}
	AlarmClock.prototype.setDisplayAlaram = function(input){
		displayAlarm = input;
	}
//===================Alarm clock End===========	
//=============================================
//===================Stopper start=============

	var Stopper = function(i_obj){

		this.intervalTime = 10;
		this.typeId = "Stopper";
		this.updateStopper = true;
		this.timeUpdate = i_obj.timeUpdate;
		this.context = i_obj.context;

	}


	Stopper.prototype = new Clock();
	Stopper.prototype.stopperStart = function(){
		//switch the stoppper to active state
		this.runTime();
	}
	Stopper.prototype.stopRun = function(){
		clearInterval(this.intervalId);
	}
	Stopper.prototype.zero = function(){
		this.minCounter = 0;
		this.secCounter = 0;
		this.milliSecCounter = 0;
	}


	///this function will update the html with the current value
	Stopper.prototype.getTime =	function(){
		var min,sec,mili,clockTime;
		min = this.timeFormat(this.minCounter);
		sec = this.timeFormat(this.secCounter);
		mili = this.timeFormat(this.milliSecCounter);
		clockTime = min+":"+sec+":"+mili;


		if(this.updateStopper){
			return clockTime;
		}
		
	};

	Stopper.prototype.setUpdateStopper = function(input){
		this.updateStopper = input;
	}
//===================Stopper End===============	
//=============================================
//===================Timer start===============


	var Timer = function(i_obj){
		// var defaultTime = "00:15:00";
		// Clock.prototype.constructor.call(this);
		var that = this;
		var buttonEl,stopperBoxEl,el,idObj,element,textBoxEl;
		this.alarmTime = "00:00:00";
		this.typeId = "Timer";
		this.intervalTime = 10;

		this.timeUpdate = i_obj.timeUpdate;
		this.alarmFunction = i_obj.alarmToggle;
		this.context = i_obj.context;
		
		this.alramChange = new CustomEvent("alarmChange", {
			detail: {id: this.typeId}
		});
	}

	Timer.prototype = new Clock();

	Timer.prototype.inputConvert = function(str) {
		this.hourDisplayTime = Number(str[0]+str[1]);
		this.minDisplayStartTime  = Number(str[3]+str[4]);
		this.secDisplayStartTime  = Number(str[6]+str[7]);
	}

	Timer.prototype.setTime =	function(val){
		this.startTime = val || "00:15:00";
		this.inputConvert(this.startTime);
	}
	Timer.prototype.stopRun = function(){
		clearInterval(this.intervalId);
	}
	//this function make the time subtract from the current time
	Timer.prototype.subTime = function(){

		if(this.milliSecCounter === 0){
			if(this.hourDisplayTime > 0 && this.minDisplayStartTime === 0 && this.secDisplayStartTime === 0){
				this.minDisplayStartTime = 59;
				this.secDisplayStartTime = 59;
				this.hourDisplayTime --;					
			}
			else if(this.secDisplayStartTime === 0 && this.minDisplayStartTime > 0){
				this.secDisplayStartTime = 59;
				if(this.minDisplayStartTime > 0)
				this.minDisplayStartTime --;	
			}else{
				if(this.minDisplayStartTime > 0 || this.secDisplayStartTime > 0)
				this.secDisplayStartTime --;
			}

		}

	}
	Timer.prototype.getTime = function(){
		this.clockTime = this.timeFormat(this.hourDisplayTime) +":"+this.timeFormat(this.minDisplayStartTime) +":"+this.timeFormat(this.secDisplayStartTime);
		if(this.clockTime === this.alarmTime){
			// document.dispatchEvent(this.alramChange);
			this.alarmFunction.call(this.context);

		}
		this.subTime();
		return this.clockTime;
	}




