<template>
<div class="calender-wrapper">
  <input type="text"   @focus="calenderStatus('focus')" @blur="calenderStatus('blur')" v-model="currentBSDateString">
  <div class="calender-interface" @mouseover="insideCalender=true" @mouseout="insideCalender=false" v-bind:class="{hide:hideCalender,show:!hideCalender}">
    <div class="info-container">
      <ul>
        <li class="text-left nextprev">
          <button @click="changeMonth(-1)">
            <span class="tri-1"></span>
          </button>
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
          <button @click="changeMonth(1)"><span class="tri-2"></span></button>
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
  name:"Calender",
  props:['adDate'],
  watch: {
    adDate: {
      handler:function(n,o) {
        this.currentADDate = n.adDate ? n.adDate : o.adDate;
        this.currentADDate = this.currentADDate ? new Date(this.currentADDate): new Date();
        this.currentBSDate = this.dateConversion.getBsDateByAdDate(this.currentADDate.getFullYear(), this.currentADDate.getMonth() + 1, this.currentADDate.getDate()+1);
        this.createCalender();
      },
      deep: true
    }
  },
  mounted() {
    this.currentADDate = this.adDate ? new Date(this.adDate): this.currentADDate;
    this.currentBSDate = this.dateConversion.getBsDateByAdDate(this.currentADDate.getFullYear(), this.currentADDate.getMonth() + 1, this.currentADDate.getDate()+1);
    this.currentBSDateString = this.dateConversion.getNepaliNumber(this.currentBSDate.bsYear)+'/'+this.dateConversion.getNepaliNumber(this.currentBSDate.bsMonth)+'/'+this.dateConversion.getNepaliNumber(this.currentBSDate.bsDate);
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
      this.currentBSDateString = this.dateConversion.getNepaliNumber(this.currentBSDate.bsYear)+'/'+this.dateConversion.getNepaliNumber(this.currentBSDate.bsMonth)+'/'+this.dateConversion.getNepaliNumber(this.currentBSDate.bsDate);
      this.currentADDate = this.dateConversion.getAdDateByBsDate(this.currentBSDate.bsYear,this.currentBSDate.bsMonth,this.currentBSDate.bsDate-1);
      this.$emit('dateSelected', this.currentADDate);
      this.hideCalender = true;
   },
    createCalender(){
      this.monthDaysArray =[];
      const maxMonthDays = this.dateConversion.getBsMonthDays(this.currentBSDate.bsYear, this.currentBSDate.bsMonth);
      const adDate = this.dateConversion.getAdDateByBsDate(this.currentBSDate.bsYear, this.currentBSDate.bsMonth, 1);
      const skipDays = adDate.getDay();
      const monthStartIndex = -skipDays;
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
.calender-wrapper{position: relative;}
.calender-interface {
    display: inline-block;
    position: absolute;
    top:25px;
    left: 0;
}
.calender-interface {
    display: inline-block;
    border: 1px solid #dbdbdb;
    padding: 8px;
}
.hide{display: none!important;}

.info-container {
    margin: 0;
    border-radius: 5px 5px 0px 0px;
}

.info-container ul {
    list-style: none;
    padding: 0;
    display: flex;
    margin: 0;
    padding: 10px 0px 10px 0px;
}

.text-left {
    display: inline-block;
    flex: 1;
}

.date-info .text-center {
    display: inline-block;
    flex: 2;
}

.date-info select:first-child {
    margin-right: 2px;
    cursor: pointer;
}

.date-info select {
    padding: 2px;
    font-size: 0.8rem;
    cursor: pointer;
}

.text-right {
    display: inline-block;
    flex: 1;
}

.text-right button {
    float: right;
    border: none;
    font-weight: 900;
    background: transparent;
    cursor: pointer;
    color: #939393;
}

.text-left button {
    border: none;
    font-weight: 900;
    background: transparent;
    cursor: pointer;
    color: #939393;
}

.calender-table tr th {
    font-size: 14px;
    padding: 3px;
    font-weight: 500;
}

.calender-table tbody tr td {
    transition: 0.2s;
    text-align: center;
    padding:0;
}

.calender-table tbody tr td:hover {
    cursor: pointer;
}

.calender-table tbody tr td a {
    text-decoration: none;
    font-size: 14px;
    color: #576574;
    padding: 12px 17px;
}

.calender-table tbody tr td:last-child a {
    color: red !important;
}

.caleder-dates tbody {
    height: 180px;
}

.tri-1 {
    width: 0px;
    height: 0;
    border-top: 7px solid transparent;
    border-right: 14px solid #313131;
    border-bottom: 7px solid transparent;
    display: inline-block;
    cursor: pointer;
}

.select-section {
    margin-top: -1px;
}

.tri-2 {
    width: 0px;
    height: 0;
    border-top: 7px solid transparent;
    border-left: 14px solid #313131;
    border-bottom: 7px solid transparent;
    display: inline-block;
    float: right;
    margin-top: 2px;
    cursor: pointer;
}
</style>