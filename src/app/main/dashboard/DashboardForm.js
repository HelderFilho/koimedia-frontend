import CommonForm from "app/components/form/CommonForm";
import {useState, useEffect} from 'react'
import Store from 'app/utils/Store'
import axios from "axios";
import Constants from "app/utils/Constants";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import './Dashboard.css'
import moment from "moment";
export default function Dashboard() {
    let logged_user = Store.USER

    const [values, setValues] = useState([]);
    const [agencies, setAgencies] = useState([])
    const [clients, setClients] = useState([])
    const [vehicles, setVehicles] = useState([])
   
    const [totalProposals, setTotalProposals] = useState(0)
    const [totalProposalsOpen, setTotalProposalsOpen] = useState(0)
    const [totalProposalsApproved, setTotalProposalsApproved] = useState(0)

    const [proposals, setProposals] = useState([])
    const [allProposals, setAllProposals] = useState([])

    const [selectedClient, setSelectedClient] = useState(0)
    const [selectedAgency, setSelectedAgency] = useState(0)
    const [selectedVehicle, setSelectedVehicle] = useState(0)
    const [selectedStartDate, setSelectedStartDate] = useState(moment().format('YYYY-MM-01'))
    const [selectedEndDate, setSelectedEndDate] = useState(moment().format('YYYY-MM-DD'))
    values.start_date = moment().format('YYYY-MM-01')
    values.end_date = moment().format('YYYY-MM-DD')
    const [Mailings, setMailings] = useState([])

    useEffect(() => {
        axios
        .get(
          Constants.APIEndpoints.AGENCY + "/getAllAgencies")
         .then((res) => {
          setAgencies(res.data[0])
        })
    
        axios
        .get(
          Constants.APIEndpoints.MAILING + "/getNextBirthdays")
         .then((res) => {
             setMailings(res.data[0])
        })
        
        axios
        .get(
          Constants.APIEndpoints.CLIENT + "/getAllClients")
         .then((res) => {
          setClients(res.data[0])
        })
    
        axios
        .get(
          Constants.APIEndpoints.VEHICLE + "/getAllVehicles")
         .then((res) => {
          setVehicles(res.data[0])
        })
    

        axios
        .get(
          Constants.APIEndpoints.PROPOSAL + "/getAllProposals")
         .then((res) => {
          setProposals(res.data[0])
          setAllProposals(res.data[0])
        })
    },[])
    
    let vehicleOptions = []
    if (["admin", "subadmin"].includes(logged_user.role)){
        vehicles.map(v => {
            vehicleOptions.push({
                value: v.id_vehicle, label: v.fancy_name
            })
        })
    }else{
        vehicles.filter(v => logged_user.fk_id_vehicle.includes(v.id_vehicle)).map(ve => {
            vehicleOptions.push({
                value: ve.id_vehicle, label: ve.fancy_name
            })

        })
    }

    let clientOptions = []
  clients.map(c => {
            clientOptions.push({
                value: c.id_client, label: c.fancy_name
            })
        })
   

        let agencyOptions = []
        agencies.map(a => {
                  agencyOptions.push({
                      value: a.id_agency, label: a.fancy_name
                  })
              })
         
    let fields = [
        {
          col: 2,
          type: "date",
          name: "start_date",
          label: "Data Inicial",
        },
        {
          col: 2,
          type: "date",
          name: "end_date",
          label: "Data Final",
        },
        {
          col: 2,
          type: "select",
          name: "fk_id_agency",
          label: "Agência",
          options: agencyOptions
        },
        {
          col: 2,
          type: "select",
          name: "fk_id_client",
          label: "Cliente",
          options: clientOptions

        },
        {
          col: 2,
          type: "select",
          name: "fk_id_vehicle",
          label: "Veículo",
          options: vehicleOptions
        },
    ]    

    let proposals_filter = proposals

    if (selectedAgency>0){
        proposals_filter = proposals_filter.filter(p => p.fk_id_agency == selectedAgency)
    }


    if (selectedClient>0){
        proposals_filter = proposals_filter.filter(p => p.fk_id_client == selectedClient)
    }

    if (selectedVehicle>0){
        proposals_filter = proposals_filter.filter(p => p.fk_id_vehicle == selectedVehicle)
    }

    if (selectedStartDate && selectedEndDate){
        proposals_filter = proposals_filter.filter(p => p.dt_emission >= selectedStartDate && p.dt_emission <= selectedEndDate)
        
    }

    let total_proposals = proposals_filter && proposals_filter.reduce((current, next) => {
        let value = next.proposal_values != null && next.proposal_values[0] ? next.proposal_values[0].gross_value_proposal : 0
        return current + value
    }, 0)
    //ID DO STATUS APROVADA É 3
    let total_proposals_approved = proposals_filter && proposals_filter.filter(p => p.fk_id_status ==  3).reduce((current, next) => {
        let value = next.proposal_values != null && next.proposal_values[0] ? next.proposal_values[0].gross_value_proposal : 0
        return current + value
    },0)

    let total_proposals_open =proposals_filter && proposals_filter.filter(p => p.fk_id_status !=  3).reduce((current, next) => {
        let value = next.proposal_values != null && next.proposal_values[0] ? next.proposal_values[0].gross_value_proposal : 0
        return current + value
    },0)



    return (
        <div>
     <CommonForm
        values={values}
        fields={fields}
        onChangeField={(f, v) => {
          values[f.name] = v;
          setValues(values);
            if (f.name == "fk_id_client"){
                setSelectedClient(v)
            }
            if (f.name == "fk_id_agency"){
                setSelectedAgency(v)
           
            }
             if (f.name == "fk_id_vehicle"){
                setSelectedVehicle(v)
            }
            if (f.name == "start_date"){
                setSelectedStartDate(v)
            }
             if (f.name == "end_date"){
                setSelectedEndDate(v)
            }
        }}
      />
 
     <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
            <Grid item xs={3}>  
                <div className="card">
                    <label className="title">TOTAL DAS PROPOSTAS</label> 
                    <label className="value">{total_proposals.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</label>  
                </div>
            </Grid>
            <Grid item xs={3}>  
                <div className="card">
                    <label className="title">TOTAL DAS PROPOSTAS EM ABERTO</label> 
                    <label className="value">{total_proposals_open.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</label>  
                </div>
            </Grid>
            <Grid item xs={3}>  
                <div className="card">
                    <label className="title">TOTAL DAS PROPOSTAS APROVADAS</label> 
                    <label className="value">{total_proposals_approved.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</label>  
                </div>
            </Grid>
            <Grid item xs={2}>  
                <div className="card">
                    <label className="title_mailings">PRÓXIMOS ANIVERSÁRIOS</label> 
                    {Mailings.map(m => (
                        <label className= "value_mailings">{m.name} - {m.company_function} - {moment(m.dt_birthday).format('DD/MM')}</label>
                    ))}

                </div>
            </Grid>
   
        
        </Grid>
    </Box>

 
        </div>
    )
}