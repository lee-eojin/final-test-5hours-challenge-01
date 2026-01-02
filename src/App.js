import { DAYS, DAYS_IN_MONTH, HOLIDAYS, ERROR_MESSAGE } from "./constants.js";
import InputView from "./InputView.js";
import OutputView from "./OutputView.js";
import { Console } from "@woowacourse/mission-utils";

class App {
  async run() {
    const inputView = new InputView();
    const outputview = new OutputView();

    const MonthAndStartDay = await this.readMonthAndStartDay(inputView);
    const [month, startDay] = MonthAndStartDay.split(",");

    const { weekdayworkers, holidayworkers } = await this.readWorkers(
      inputView
    );
    const schedule = this.createSchedule(
      Number(month),
      startDay,
      weekdayworkers,
      holidayworkers
    );

    outputview.printSchedule(schedule);
  }

  async readMonthAndStartDay(inputView) {
    try {
      const input = await inputView.readMonthAndStartDay();
      const [monthStr, startDay] = input.split(",");
      this.validateMonthAndStartDay(Number(monthStr), startDay);
      return input;
    } catch (error) {
      Console.print(error.message);
      return this.readMonthAndStartDay(inputView);
    }
  }

  validateMonthAndStartDay(month, startDay) {
    if (month < 1 || month > 12 || Number.isNaN(month)) {
      throw new Error(ERROR_MESSAGE);
    }
    if (!DAYS.includes(startDay)) {
      throw new Error(ERROR_MESSAGE);
    }
  }

  async readWorkers(inputView) {
    try {
      const weekdayworkers = await inputView.readWeekdayWorkers();
      const holidayworkers = await inputView.readHolidayWorkers();
      this.validateWorkers(weekdayworkers);
      this.validateWorkers(holidayworkers);
      return { weekdayworkers, holidayworkers };
    } catch (error) {
      Console.print(error.message);
      return this.readWorkers(inputView);
    }
  }

  validateWorkers(workers) {
    if (workers.length < 5 || workers.length > 35) {
      throw new Error(ERROR_MESSAGE);
    }
    if (new Set(workers).size !== workers.length) {
      throw new Error(ERROR_MESSAGE);
    }
    for (const worker of workers) {
      if (worker.length > 5) {
        throw new Error(ERROR_MESSAGE);
      }
    }
  }

  isHoliday(month, day, dayOfWeek) {
    if (dayOfWeek === "토" || dayOfWeek === "일") {
      return true;
    }

    const key = `${month}-${day}`;
    return HOLIDAYS.includes(key);
  }

  createSchedule(month, startDay, weekdayworkers, holidayworkers) {
    const schedule = [];
    const totalDays = DAYS_IN_MONTH[month];
    let currentDayIndex = DAYS.indexOf(startDay);

    let weekdayIndex = 0;
    let holidayIndex = 0;
    let prevWorker = null;

    for (let day = 1; day <= totalDays; day++) {
      const dayOfWeek = DAYS[currentDayIndex];
      const isHoliday = this.isHoliday(month, day, dayOfWeek);

      let worker;
      if (isHoliday) {
        worker = holidayworkers[holidayIndex % holidayworkers.length];
        holidayIndex++;
      }
      if (!isHoliday) {
        worker = weekdayworkers[weekdayIndex % weekdayworkers.length];
        weekdayIndex++;
      }

      schedule.push({ month, day, dayOfWeek, worker, isHoliday });
      prevWorker = worker;

      currentDayIndex++;
      if (currentDayIndex === 7) {
        currentDayIndex = 0;
      }
    }
    return schedule;
  }
}

export default App;
