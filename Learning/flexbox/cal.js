function getCalData() {
  let currYear = moment().year();
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
        date: currDay.format("D")
      });

    } while(!currDay.isSame(satAftereMo))

    out.months.push(monthData);
  }

  return out;
}

function formatHTML(data) {
  // debugger;
  let source   = document.querySelector("#cal-template").innerHTML;
  let template = Handlebars.compile(source);
  let html = template(data);
  document.querySelector("#cal-dock").innerHTML = html;
}

function start() {
  let out = getCalData();
  formatHTML(out);
}

window.addEventListener('load', start);