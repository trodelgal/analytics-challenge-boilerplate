///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

import {
  Event,
  weeklyRetentionObject,
  RetentionCohort,
  Filter,
  DaysEvents,
  HoursEvents,
  eventName,
} from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";
import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import {
  getAllEvents,
  getEventById,
  getWeekEventGroupByDays,
  getDayEventsGroupByHours,
  getEventFiltered,
  createEvent,
  getEventByType,
  getStartOfDayTime,
  getEndOfDayTime,
  getOStartOfWeekTime,
  getDayString,
  todayEvents,
  thisWeekEvents
} from "./database";
const router = express.Router();

  const OneHour: number = 1000 * 60 * 60; 
  const OneDay: number = OneHour * 24
  const OneWeek: number = OneDay*7

// Routes

router.get("/all", (req: Request, res: Response) => {
  try{
    const events: Event[] = getAllEvents();
    res.send(events);
  }catch(err){
    res.status(500).send(err.message);
  }
});

router.get("/all-filtered", (req: Request, res: Response) => {
  try{
    const filters: Filter = req.query;
    const events = getEventFiltered(filters);
    let searchEvents: Event[] = [];
    const search = filters.search ? filters.search : "";
    events.map((event) => {
      if (
        event._id.includes(search) ||
        event.session_id.includes(search) ||
        event.name.includes(search) ||
        event.distinct_user_id.includes(search) ||
        event.os.includes(search) ||
        event.browser.includes(search)
      ) {
        searchEvents.push(event);
      }
    });
    if (filters.offset && searchEvents.length > filters.offset) {
      const offsetEvents = searchEvents.slice(0, filters.offset);
      const results = {
        events: offsetEvents,
        more: true,
      };
      res.send(results);
    } else {
      const results = {
        events: searchEvents,
        more: false,
      };
      res.send(results);
    }
  }catch(err) {
    res.status(500).send(err.message);
  }
});

router.get("/by-days/:offset", (req: Request, res: Response) => {
  try{
    let { offset } = req.params;
    const events = getWeekEventGroupByDays(parseInt(offset));
  
    let resultsArr: DaysEvents[] = [];
    for (let key in events) {
      let counter: string[] = [];
      events[key].map((dayEvent) => {
        if (!counter.includes(dayEvent.session_id)) {
          counter.push(dayEvent.session_id);
        }
      });
      const date = new Date(events[key][0].date).getTime();
      resultsArr.push({ date:getDayString(date), count: counter.length });
    }
    resultsArr.sort((a: DaysEvents, b: DaysEvents) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    res.send(resultsArr);
  }catch(err) {
    res.status(500).send(err.message)
  }
});


router.get("/by-hours/:offset", (req: Request, res: Response) => {
  try{
    let { offset } = req.params;
    const events = getDayEventsGroupByHours(parseInt(offset));
    let resultsArr: HoursEvents[] = [];
    for (let i = 0; i < 24; i++) {
      resultsArr.push({ hour: i, count: 0 });
    }
  
    for (let key in events) {
      let counter: string[] = [];
      events[key].map((hourEvent) => {
        if (!counter.includes(hourEvent.session_id)) {
          counter.push(hourEvent.session_id);
        }
      });
      const hour = new Date(events[key][0].date).getHours();
      resultsArr.forEach((obj) => {
        if (obj.hour === hour) {
          obj.count = counter.length;
        }
      });
    }
    resultsArr.forEach((obj) => {
      if (obj.hour < 10) {
        obj.hour = `0${obj.hour}:00`;
      } else {
        obj.hour = `${obj.hour}:00`;
      }
    });
    res.send(resultsArr);
  }catch(err) {
    res.status(500).send(err.message)
  }
});

router.get("/today", (req: Request, res: Response) => {
  try{
    const todeyEvents = todayEvents();
    res.send(todeyEvents);
  }catch(err) {
    res.status(500).send(err.message);
  }
});

router.get("/week", (req: Request, res: Response) => {
  try{
    const thisWeekEvent = thisWeekEvents()
    res.send(thisWeekEvent);
  }catch(err) {
    res.status(500).send(err.message);
  }
});

router.get("/retention", (req: Request, res: Response) => {
  try{
    let dayZero = getStartOfDayTime(parseInt(req.query.dayZero));
    // dayZero = getStartOfDayTime(dayZero)
    console.log("dayZero",dayZero);
      const timeNow = getEndOfDayTime(Date.now());
      const weeks:number[] = [dayZero];
      for(let time = dayZero + OneWeek; time<= timeNow; time+= OneWeek){
        if(new Date(time).getHours() != 0){
          weeks.push(getStartOfDayTime(time+OneDay));
        }else {
          weeks.push(time);
        }
      }
    console.log('weeks',weeks);
    
    const allEvents = getAllEvents()
    const weekEvents = weeks.map((week, i) => {
      let weekTime:number;
      if(i < weeks.length -1){
        weekTime = weeks[i+1];
      }else{
        weekTime = week + OneWeek;
      }
      const weekEvents2 = allEvents.filter(event => event.date >= week && event.date < weekTime);
      return weekEvents2;
    })
    const singupsArr = weekEvents.map((week, i) => {
      const signupForThatWeek = getEventByType('signup',week).map((event: Event) => event.distinct_user_id );
      return signupForThatWeek;
    })
    let arrToSend :weeklyRetentionObject[];
    for(let thisWeek = 0; thisWeek < weekEvents.length; thisWeek ++){
      const weeklyRetention = weekEvents.slice(thisWeek, weekEvents.length).map((events:Event[], i:number) =>{
        const newArr = singupsArr[thisWeek].filter((signup:string) => events.some(event => event.distinct_user_id === signup))
        return Math.round(singupsArr[thisWeek].length === 0 ? 0 :newArr.length * 100 / singupsArr[thisWeek].length);
      })
      let weekTime;
      if(thisWeek < weeks.length -1){
        weekTime = weeks[thisWeek+1];
      }else{
        weekTime = weeks[thisWeek]+OneWeek;
      }
        const retentionObj:weeklyRetentionObject = {
          registrationWeek: thisWeek,
          newUsers: singupsArr[thisWeek].length,
          weeklyRetention: weeklyRetention,
          start: getDayString(weeks[thisWeek]),
          end: getDayString(weekTime)
        }
        if(thisWeek === 0){
          arrToSend =[retentionObj]
        }else{
          arrToSend!.push(retentionObj)
        }
    }
  console.log("arrToSend",arrToSend!);
  
    res.send(arrToSend!);
  }catch(err) {
    res.status(500).send(err.message);
  }
});

router.get("/:eventId", (req: Request, res: Response) => {
  try{
    const event: Event[] = getEventById(req.params.eventId);
    res.send(event);
  }catch(err){
    res.status(500).send(err.message);
  }
});

router.post("/", (req: Request, res: Response) => {
  try{
    const addEvent = createEvent(req.body);
    res.send(addEvent);
  }catch(err){
    res.status(500).send(err.message);
  }
});

// router.get("/chart/os/:time", (req: Request, res: Response) => {
//   const time = req.params.time;
//   if(time === 'all'){
//     return res.send(getAllEvents())
//   }else if(time === 'today'){
//     return res.send(getTodayEvents())
//   }else if(time === 'week'){
//     return res.send(getThisWeekEvents())
//   }else{
//     return res.sendStatus(404).send('bad request');
//   }
// });

// router.get("/chart/pageview/:time", (req: Request, res: Response) => {
//   const time = req.params.time;
//   if(time === 'all'){
//     return res.send(getAllEvents())
//   }else if(time === 'today'){
//     return res.send(getTodayEvents())
//   }else if(time === 'week'){
//     return res.send(getThisWeekEvents())
//   }else{
//     return res.sendStatus(404).send('bad request');
//   }
// });

// router.get("/chart/timeonurl/:time", (req: Request, res: Response) => {
//   const time = req.params.time;
//   if(time === 'all'){
//     return res.send(getAllEvents())
//   }else if(time === 'today'){
//     return res.send(getTodayEvents())
//   }else if(time === 'week'){
//     return res.send(getThisWeekEvents())
//   }else{
//     return res.sendStatus(404).send('bad request');
//   }
// });

// router.get("/chart/geolocation/:time", (req: Request, res: Response) => {
//   const time = req.params.time;
//   if(time === 'all'){
//     return res.send(getAllEvents())
//   }else if(time === 'today'){
//     return res.send(getTodayEvents())
//   }else if(time === 'week'){
//     return res.send(getThisWeekEvents())
//   }else{
//     return res.sendStatus(404).send('bad request');
//   }
// });
export default router;
