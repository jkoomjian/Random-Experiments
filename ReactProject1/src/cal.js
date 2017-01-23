import moment from 'moment';
import calTemplate from './cal-template.handlebars';

//import static assets
import './cal.scss';


var currYear = moment().year();

function getCalData() {
  let out = {daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
              currYear: currYear,
              months: []
            };

  for (let i=0; i<12; i++) {

    let monthData = {};
    monthData.currMonthFull = moment({year: currYear, month: i, date: 1}).format("MMMM");
    monthData.currMonthShort = moment({year: currYear, month: i, date: 1}).format("MMM");
    monthData.dates = [];

    let firstOfMo = moment({year: currYear, month: i, date: 1});
    let daysInMo = firstOfMo.clone().endOf("month").date();
    let sunBeforeMo = firstOfMo.day(-0);
    let satAftereMo = moment({year: currYear, month: i, date: daysInMo}).day(6);

    let currDay = sunBeforeMo.clone();
    currDay.add(-1, 'days');

    do {
      currDay.add(1, 'days');

      // console.log("procesing page: ", currDay.format());
      monthData.dates.push({
        dayOfWeek: currDay.format("ddd"),
        date: currDay.format("D"),
        inMonth: currDay.format("M") == (i + 1) ? "true" : "false"
      });

    } while(!currDay.isSame(satAftereMo))

    out.months.push(monthData);
  }

  return out;
}

function formatHTML(data) {
  let html = calTemplate(data)
  document.querySelector("#cal-dock").innerHTML = html;
  document.querySelector("#prevYear").addEventListener('click', decYear);
  document.querySelector("#nextYear").addEventListener('click', incYear);
}

function incYear() {return changeYear(1);}
function decYear() {return changeYear(-1);}

function changeYear(amt) {
  currYear = (parseInt(currYear, 10) + amt) + "";
  generateCal();
  return false;
}

function generateCal() {
  let out = getCalData();
  formatHTML(out);
}

window.addEventListener('load', function() {
  generateCal();
});
