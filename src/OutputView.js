import { Console } from "@woowacourse/mission-utils";

class OutputView {
  printSchedule(schedule) {
    for (const item of schedule) {
      const { month, day, dayOfWeek, worker, isHoliday } = item;

      let dayText = dayOfWeek;

      if (isHoliday && dayOfWeek !== "토" && dayOfWeek !== "일") {
        dayText = `${dayOfWeek}(휴일)`;
      }
      Console.print(`${month}월 ${day}일 ${dayText} ${worker}`);
    }
  }
}

export default OutputView;