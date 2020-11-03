import React, { useEffect, useState, useCallback } from "react";
import TextField from "@material-ui/core/TextField";
import { weeklyRetentionObject } from "../../models/event";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ReferenceLine,
// } from "recharts";
import axios from "axios";
import { getDayString, getStartOfDayTime, OneHour, OneDay, OneWeek } from "../../helpFunctions";
import { withStyles, Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const RetentionCohort: React.FC = () => {
  const [retentionData, setRetentionDate] = useState<weeklyRetentionObject[]>();
  const [dayZero, setDayZero] = useState<number>();
  const classes = useStyles();

  const fetchRetentionData = useCallback(async () => {
    const { data } = await axios.get(
      `http://localhost:3001/events/retention?dayZero=1601837638212`
    );
    console.log(data);
    setRetentionDate(data);
  }, []);

  useEffect(() => {
    fetchRetentionData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            {retentionData &&
              retentionData.map((week, i) => {
                  return(
                      <StyledTableCell align="right">Week {i}</StyledTableCell>
                  )
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
                  </StyledTableCell>
                  {week.weeklyRetention.map((value) => {
                    return <StyledTableCell align="right">{value}</StyledTableCell>;
                  })}
                </StyledTableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RetentionCohort;
