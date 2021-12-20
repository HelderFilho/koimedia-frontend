import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CommonHeader from "../../components/table/CommonHeader";
import "./CommonView.css";
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function CommonView({ data, title, onBack, dialog }) {
  return (
    <div style={{ width: "96%" }}>
      {!dialog ? <CommonHeader title={title} onBack={onBack} /> : null}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          {Object.entries(data).map(d => {
            return(
            <Grid item xs={d[1].col}>
              {d[1].isMulti ? (
              <div className="card_multiple">
                  {d[1].values.map(v => (
                    <div>
                <label className="title"> {v.label}</label>
                <label className="value">{v.value}</label>
                      
                      </div>
                  ))}
              </div>
              ):(
                <div className="card">
                <label className="title"> {d[1].label}</label>
                <label className="value">{d[1].value}</label>
              </div>
            
              )
              }
            </Grid>
            )
          })}

          {/*
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
        */}
        </Grid>
      </Box>{" "}
    </div>
  );
}
