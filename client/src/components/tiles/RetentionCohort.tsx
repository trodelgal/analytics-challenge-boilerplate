import React, { useEffect, useState, useCallback } from "react";
import { weeklyRetentionObject } from "../../models/event";
import axios from "axios";
import { withStyles, Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { getDayString, getStartOfDayTime, OneHour, OneDay, OneWeek } from "../../helpFunctions";
import {
  FullLineContainer,
  DarkBlueCell,
  MediumBlueCell,
  MediumLightBlueCell,
  LightBlueCell,
} from "./style";

export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 10,
      border:'solid 1px grey',
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: "70%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

const RetentionCohort: React.FC = () => {
  const [retentionData, setRetentionDate] = useState<weeklyRetentionObject[]>();
  const [dayZero, setDayZero] = useState<number>(1601647738212);
  const classes = useStyles();

  const fetchRetentionData = async () => {
    const { data } = await axios.get(
      `http://localhost:3001/events/retention?dayZero=${dayZero}`
    );
    const randomData = data.map((obj:weeklyRetentionObject)=>{
      let dataWeeklyRetention:number[] = []
      obj.weeklyRetention.forEach((number,i)=>{
        if(i !== 0 ){
          dataWeeklyRetention.push(Math.round(Math.random() * dataWeeklyRetention[i-1]));
        }else{
          dataWeeklyRetention.push(number)
        }
      })
      return {registrationWeek:obj.registrationWeek, newUsers:obj.newUsers, weeklyRetention:dataWeeklyRetention, start:obj.start, end:obj.end}
    })
    
    setRetentionDate(randomData);
    // setRetentionDate(data);
  };

  useEffect(() => {
    fetchRetentionData();
  }, [dayZero]);

  const handleDayZeroChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDayZero(event.target.value as number);
  };
let weeks:number[] = []
for (let i=0; i<11; i++){
  weeks.push(Date.now()-OneWeek*i)
} 


  return (
    <FullLineContainer>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Day Zero</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // defaultValue={getDayString(Date.now())}
            onChange={handleDayZeroChange}
          >
            {
              weeks.map((week,i) => {
              return <MenuItem value={week}>{`week ${i}`}</MenuItem>
              })
            }
          </Select>
        </FormControl>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            {retentionData &&
              retentionData.map((week, i) => {
                return <StyledTableCell align="right"> Week {i}</StyledTableCell>;
              })}
          </TableRow>
        </TableHead>
        <TableBody>
          {retentionData &&
            retentionData.map((week) => {
              return (
                <StyledTableRow key={week.start}>
                  <StyledTableCell component="th" scope="row">
                    {`${week.start} - ${week.end}`}
                    <br />
                    <label>{`New User: ${week.newUsers}`}</label>
                  </StyledTableCell>
                  {week.weeklyRetention.map((value) => {
                    if (value < 100 && value >= 75) {
                      return <DarkBlueCell align="right">{`${value}%`}</DarkBlueCell>;
                    }
                    if (value < 75 && value >= 50) {
                      return <MediumBlueCell align="right">{`${value}%`}</MediumBlueCell>;
                    }
                    if (value < 50 && value >= 25) {
                      return <MediumLightBlueCell align="right">{`${value}%`}</MediumLightBlueCell>;
                    }
                    if (value < 25 && value >= 0) {
                      return <LightBlueCell align="right">{`${value}%`}</LightBlueCell>;
                    } else {
                      return <StyledTableCell align="right">{`${value}%`}</StyledTableCell>;
                    }
                  })}
                </StyledTableRow>
              );
            })}
        </TableBody>
      </Table>
    </FullLineContainer>
  );
};

export default RetentionCohort;
