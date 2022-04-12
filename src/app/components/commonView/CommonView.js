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
            return (
              <Grid item xs={d[1].col}>
                {d[1].isMulti ? (
                  <div className="card_multiple">
                    {d[1].values.map(v => (
                      <div>
                        <label className="text_label"> {v.label}</label>
                        {v.isHTML ? (
                          <div className="text_value" dangerouslySetInnerHTML={{ __html: v.value }} />
                        ) :
                          (
                            <label className="text_value">{v.value}</label>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card">
                    <label className="text_label"> {d[1].label}</label>
                    {d[1].isHTML ? (
                      <div className="text_value" dangerouslySetInnerHTML={{ __html: d[1].value }} />
                    ) : 
                    d[1].isFile ? (
                      <div>
                        {d[1].values.map(file => (
                          <div>
                          <label className="text_value_files" onClick={() => window.open(file.webViewLink, '_blank')} style={{ cursor: 'pointer' }}>{file.name}</label>
                          </div>
                        ))}
                      </div>
                    ) :
                      (
                        <label className="text_value">{d[1].value}</label>
                      )}
                  </div>

                )
                }
              </Grid>
            )
          })}
        </Grid>
      </Box>{" "}
    </div>
  );
}
