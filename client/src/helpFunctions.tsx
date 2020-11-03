export function getDayString(dateNow: number): string {
  let year = new Date(dateNow).getFullYear();
  let day = new Date(dateNow).getDate();
  let month = new Date(dateNow).getMonth() + 1;
  return `${year}/${month}/${day}`;
}

export const OneHour: number = 1000 * 60 * 60;
export const OneDay: number = OneHour * 24;
export const OneWeek: number = OneDay * 7;

export const getStartOfDayTime = (dateNow:number): number=>{
    const date = getDayString(dateNow)
    const startOfDay = new Date(date);
    return startOfDay.getTime();
  }