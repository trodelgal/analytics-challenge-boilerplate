import styled from "styled-components";

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
  width:50%;
  height:300px;
  margin:0.5%;
  padding:1% 2% 1% 1%;
  border:1px solid #ccc;
  border-radius:3px;
`;
export const PieChartCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: space-around;
  width:50%;
  height:350px;
  margin:0.5%;
  padding:1% 2% 1% 1%;
  border:1px solid #ccc;
  border-radius:1px;
`;
export const FullLineContainer = styled.div`
  width:100%;
  height:380px;
  margin:0.5%;
  padding:1%;
  border:1px solid #ccc;
  border-radius:1px;
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
  width: 100%;
  margin:0.1%
`;
export const EventLogContainer = styled.div`
  display: flex;
  width: 100%;
`;
export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  margin: 1%;
`;

