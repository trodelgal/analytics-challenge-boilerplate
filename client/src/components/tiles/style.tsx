import styled from "styled-components";
import TableCell from "@material-ui/core/TableCell";

export const ChartTitle = styled.h2`
  font-size: 14px;
  letter-spacing: -0.6px;
  word-spacing: 2px;
  color: #000000;
  opacity: 0.7;
  font-weight: 700;
  text-decoration: none solid rgb(68, 68, 68);
  font-style: normal;
  font-variant: normal;
  text-transform: capitalize;
`;
export const ChartCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-around;
  width: 49%;
  min-width: 360px;
  height: 400px;
  margin: 0.5%;
  padding: 1% 1% 1% 1%;
  border: 1px solid #ccc;
  border-radius: 1px;
  -webkit-box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
`;
export const PieChartCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-around;
  width: 49%;
  min-width: 360px;
  height: 350px;
  margin: 0.5%;
  padding: 1% 2% 1% 1%;
  border: 1px solid #ccc;
  border-radius: 1px;
  -webkit-box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
`;
export const FullLineContainer = styled.div`
  width: 98%;
  margin: 0.5%;
  padding: 1%;
  border: 1px solid #ccc;
  border-radius: 1px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-around;
  -webkit-box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
`;
export const MapContainer = styled.div`
  width: 98%;
  height: 350px;
  margin: 0.5%;
  padding: 1%;
  border: 1px solid #ccc;
  border-radius: 1px;
  -webkit-box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
  box-shadow: 0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0, 0, 0, 0);
`;
export const DashbordLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-around;
`;
export const DashbordLine = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  margin: 0.1%;
`;
export const EventLogContainer = styled.div`
  display: flex;
  /* flex-wrap: wrap; */
  width: 100%;
`;
export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  margin: 1%;
`;
export const DarkBlueCell = styled(TableCell)`
  background-color: #1a39a8;
  border: solid 1px grey;
  font-size: 10px;
  color: white;
`;
export const MediumBlueCell = styled(TableCell)`
  background-color: #3a77e6;
  border: solid 1px grey;
  font-size: 10px;
  color: white;
`;
export const MediumLightBlueCell = styled(TableCell)`
  background-color: #9bbbf2;
  border: solid 1px grey;
  font-size: 10px;
`;
export const LightBlueCell = styled(TableCell)`
  background-color: #b0bdd4;
  border: solid 1px grey;
  font-size: 10px;
`;
