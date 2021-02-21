<template>
<div class="calender-wrapper">
  <input type="text"   @focus="calenderStatus('focus')" @blur="calenderStatus('blur')" v-model="currentBSDateString">
  <div class="calender-interface" @mouseover="insideCalender=true" @mouseout="insideCalender=false" v-bind:class="{hide:hideCalender,show:!hideCalender}">
    <div class="info-container">
      <ul>
        <li class="text-left nextprev">
          <button @click="changeMonth(-1)">&lt;</button>
        </li>
        <li class="text-center">
          <div class="date-info">
            <select id="bsYear" name="bsYear" v-model="currentBSDate.bsYear" @change="changeDate">
              <option v-for="i in bsYears" :key="i" :value="i">
                {{ dateConversion.getNepaliNumber(i) }}
              </option>
            </select>
            <select name="bsMonth" id="bsMonth" v-model="currentBSDate.bsMonth" @change="changeDate">
              <option v-for="i in bsMonths" :key="i" :value="i+1">
                {{ dateConversion.getNepaliMonthName(i) }}
              </option>
            </select>
          </div>
        </li>
        <li class="text-right nextprev">
          <button @click="changeMonth(1)">&gt;</button>
        </li>
      </ul>
    </div>
    <div class="caleder-dates">
      <table class="calender-table">
        <thead>
        <tr>
          <th v-for="(day,index) in nepaliDays" :key="index">{{ day }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(week,index) in monthDaysArray" :key="index">
          <td v-for="(day,j) in week" :key="j" v-bind:class="{active: day==currentBSDate.bsDate}">
            <a class="date-link" @click="selectDate(day)">
              {{ dateConversion.getNepaliNumber(day) }}
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  </div>
</template>
<script>
import {DateConversion} from "./DateConversion";
import {DATE_RANGE} from './constants/date-range';
import {DAYS} from './constants/days';

export default {
  props:['adDate'],
  watch: {
    adDate: function(date) {
      this.currentADDate = date;
      this.currentBSDate = this.dateConversion.getBsDateByAdDate(this.currentADDate.getFullYear(), this.currentADDate.getMonth() + 1, this.currentADDate.getDate());
      this.createCalender();
    }
  },
  mounted() {
    this.currentBSDate = this.dateConversion.getBsDateByAdDate(this.currentADDate.getFullYear(), this.currentADDate.getMonth() + 1, this.currentADDate.getDate());
    this.currentBSDateString = this.currentBSDate.bsYear+'/'+this.currentBSDate.bsMonth+'/'+this.currentBSDate.bsDate;
   this.bsYears = Array.from(Array(DATE_RANGE.maxDate - DATE_RANGE.minDate).keys()).map(e => e + 1 + DATE_RANGE.minDate);
    this.createCalender();
    
  },

  methods: {
    calenderStatus: function (type){
      if(type=='focus'){
        this.hideCalender =  false;
      }else{
        this.hideCalender = this.insideCalender? false :  true;
      }
    },
    changeMonth: function (factor){
      const month = this.currentBSDate.bsMonth+factor;
      if(month>12){
        this.currentBSDate.bsMonth = 1;
        this.currentBSDate.bsYear+= 1;

      }else if(month<1){
        this.currentBSDate.bsMonth = 12;
        this.currentBSDate.bsYear-= 1;
      }else{
        this.currentBSDate.bsMonth = month;
      }
      this.createCalender();
    },
    changeDate: function (){
      this.createCalender();
    },
    selectDate: function (day){
      this.hideCalender = false;
      this.currentBSDate.bsDate = day;
      this.currentBSDateString = this.currentBSDate.bsYear+'/'+this.currentBSDate.bsMonth+'/'+this.currentBSDate.bsDate;
      this.currentADDate = this.dateConversion.getAdDateByBsDate(this.currentBSDate.bsYear,this.currentBSDate.bsMonth+1,this.currentBSDate.bsDate);
      this.$emit('dateSelected', this.currentADDate);
      this.hideCalender = true;
   },
    createCalender(){
      this.monthDaysArray =[];
      const maxMonthDays = this.dateConversion.getBsMonthDays(this.currentBSDate.bsYear, this.currentBSDate.bsMonth);
      const adDate = this.dateConversion.getAdDateByBsDate(this.currentBSDate.bsYear, this.currentBSDate.bsMonth, 1);
      const skipDays = adDate.getDay();
      const monthStartIndex = -skipDays + 1;
      const maxMonthDaysIndex = 42;

      let weekDaysArray = [];
      let count = 1;
      for (let i = monthStartIndex; i <= maxMonthDaysIndex; i++) {
        if (i < 1 || i > maxMonthDays) {
          weekDaysArray.push('');
        } else {
          weekDaysArray.push(i);
        }
        if (count % 7 == 0) {
          this.monthDaysArray.push(weekDaysArray);
          weekDaysArray = [];
        }
        count++;
      }
    }
  },
  data() {
    return {
      dateConversion: new DateConversion(),
      insideCalender:false,
      hideCalender:true,
      currentBSDateString:'',
      currentADDate:  new Date(),
      currentBSDate: {
        bsYear: 0,
        bsMonth: 0,
        bsDate: 0
      },
      dateRange: DATE_RANGE,
      bsYears: [],
      bsMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      nepaliDays: DAYS,
      monthDaysArray: []
    }
  }
}
</script>
<style scoped>
.hide{display:none;}
.show{display:block}
.calender-interface{position:absolute;}
.calender-wrapper{position: relative;}
.calender-table thead th {
  padding: 10px;
  background: #000;
  color: #fff;
}

.calender-table tbody td {
  padding: 10px;
  background: #000;
  text-align: center;

}

.calender-table tbody td a {
  display: block;
  color: #fff;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
}

.calender-table tbody td.active {
  background: red;
}

.calender-interface {
  padding: 10px;
  border: 1px solid #ccc;
  background: #000;
}

.info-container {
  color: #fff;
  padding: 10px;
}

.info-container ul {
  list-style: none;
  width: 100%;
  list-style: none;
  width: 100%;
  margin: 0;
  padding: 0;
}

.info-container ul li {
  display: block;
  float: left;
  width: 70%;
}

.info-container ul li.nextprev {
  width: 15%;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.date-info select {
  display: inline-block;
  margin-right: 10px;
  padding: 4px 8px;
  border-radius: 3px;
  outline: none !important;
}
</style>