///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

import { Event, weeklyRetentionObject, RetentionCohort } from "../../client/src/models/event";
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
  getTodayEvents,
  getThisWeekEvents,
  getByDaysEvents,
  getByHoursEvents,
  getEventFromDayZero,
  getEventFiltered,
} from "./database";
import {
  startOfDayUTC,
  endOfDayUTC,
  startOfWeekUTC,
  endOfWeekUTC,
} from "../../client/src/utils/transactionUtils";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.get("/all", (req: Request, res: Response) => {
  const events: Event[] = getAllEvents();
  res.send(events);
});

router.get("/all-filtered", (req: Request, res: Response) => {
  const filters: Filter = req.query;
  // let opt: Filter = {
  //   sorting: "+date",
  //   type: "signup",
  //   browser: "firefox",
  //   search: "szz4XV7B3NC",
  //   offset: 5,
  // };
  const events = getEventFiltered(filters);
  let searchEvents: Event[] = [];
  const search = filters.search? filters.search:'';
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
    if (searchEvents.length > filters.offset) {
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
});

router.get("/by-days/:offset", (req: Request, res: Response) => {
  let { offset } = req.params;
  const events = getByDaysEvents(parseInt(offset));

  let resultsArr: object[] = [];
  for (let key in events) {
    let counter: string[] = [];
    events[key].map((dayEvent) => {
      if (!counter.includes(dayEvent.session_id)) {
        counter.push(dayEvent.session_id);
      }
    });
    const date = new Date(events[key][0].date).toString().slice(0, 10);
    resultsArr.push({ date: date, count: counter.length });
  }
  res.send(resultsArr);
});

router.get("/by-hours/:offset", (req: Request, res: Response) => {
  let { offset } = req.params;
  const events = getByHoursEvents(parseInt(offset));
  let resultsArr: any[] = [];
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
});

router.get("/today", (req: Request, res: Response) => {
  const events: Event[] = getTodayEvents();
  res.send(events);
});

router.get("/week", (req: Request, res: Response) => {
  const events: Event[] = getThisWeekEvents();
  res.send(events);
});

router.get("/retention", (req: Request, res: Response) => {
  const { dayZero } = req.query;
  const events = getEventFromDayZero(parseInt(dayZero));

  res.send(events);
});

router.get("/:eventId", (req: Request, res: Response) => {
  const event: Event[] = getEventById(req.params.eventId);
  res.send(event);
});

router.post("/", (req: Request, res: Response) => {
  res.send("/");
});

router.get("/chart/os/:time", (req: Request, res: Response) => {
  res.send("/chart/os/:time");
});

router.get("/chart/pageview/:time", (req: Request, res: Response) => {
  res.send("/chart/pageview/:time");
});

router.get("/chart/timeonurl/:time", (req: Request, res: Response) => {
  res.send("/chart/timeonurl/:time");
});

router.get("/chart/geolocation/:time", (req: Request, res: Response) => {
  res.send("/chart/geolocation/:time");
});

export default router;
