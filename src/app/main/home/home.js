import axios from 'axios'
import Constants from 'app/utils/Constants'
import { useState, useEffect } from 'react'
import Store from 'app/utils/Store'
let logged_user = Store.USER
import CommonDialog from "app/components/dialog/CommonDialog";
import CommonForm from "app/components/form/CommonForm";
import clsx from 'clsx';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BoardList from './BoardList'
import './home.css'
import Typography from '@material-ui/core/Typography';

export default function Home() {
    const [kanban, setKanban] = useState([
        {
            id_column_card: 1,
            name: 'RADAR',
            user_cad: 0,
            cards: []
        },
        {
            id_column_card: 2,
            name: 'CONTATO REALIZADO',
            user_cad: 0,
            cards: []
        }, {
            id_column_card: 3,
            name: 'REUNIÃO',
            user_cad: 0,
            cards: []
        }, {
            id_column_card: 4,
            name: 'BRIEFING/MEIOS',
            user_cad: 0,
            cards: []
        }, {
            id_column_card: 5,
            name: 'PLANEJAMENTO/PROPOSTAS',
            user_cad: 0,
            cards: []
        }, {
            id_column_card: 6,
            name: 'APROVAÇÃO',
            user_cad: 0,
            cards: []
        },

    ])
    const [openCreateKanban, setOpenCreateKanban] = useState(false)
    const [usersOptions, setUsersOptions] = useState([])
    const [cards, setCards] = useState([])
    const [clients, setClients] = useState([])
    const [agencies, setAgencies] = useState([])

    useEffect(() => {
        getData();

        axios.get(Constants.APIEndpoints.USER + "/getAllUsers").then(users => {
            let users_ = users.data[0].map(u => ({ value: u.id_user, label: u.name }))
            setUsersOptions(users_)
        })
        axios
            .get(
                Constants.APIEndpoints.CLIENT + "/getAllClients")
            .then((res) => {
                setClients(res.data[0])
            })

        axios
            .get(
                Constants.APIEndpoints.AGENCY + "/getAllAgencies")
            .then((res) => {
                setAgencies(res.data[0])
            })
    }, [])


    const getData = () => {
        axios.post(Constants.APIEndpoints.KANBAN + "/getKanban", { user: logged_user.id_user }).then(res => {
            setCards(res.data)
        })
    }

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result
        const columnOrigin = source.droppableId
        const columnDestination = destination.droppableId
        const cardId = draggableId.replace('card', '')
        const data = {
            fk_id_column_destination: columnDestination,
            fk_id_card: cardId
        }

        axios.post(Constants.APIEndpoints.KANBAN + "/moveCard", data).then(res => {
            getData()
        })

    }

    const createNewBusiness = (values) => {
        values.user_cad = logged_user.id_user
        axios.post(Constants.APIEndpoints.KANBAN + "/createCard", values).then(res => {
            getData()
            setOpenCreateKanban(false)
        })
    }

    const totalGrossValueFromCards = cards.reduce((sum, nextCard) => {
        return sum + parseFloat(nextCard.gross_value)
    }, 0)


    return (
        <div style={{ height: '100%' }}>
            <button className='buttonCreateNewColumn' onClick={() => setOpenCreateKanban(true)}>CRIAR NOVO NEGÓCIO</button>
            <Typography
            style = {{marginLeft: 30, marginTop: 10}}
            >{`${totalGrossValueFromCards.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} - ${cards.length} negócios`}</Typography>

            <CommonDialog
                open={openCreateKanban}
                onClose={() => setOpenCreateKanban(false)}
                title="Criar Novo Negócio"
                width="md"
            >
                <CommonForm
                    fields={[
                        {
                            col: 6,
                            name: 'subject',
                            label: 'Título',
                            type: 'text',
                            required: true
                        },{
                            col: 6,
                            name: 'contact',
                            label: 'Contato',
                            type: 'text',
                            required: true
                        },{
                            col: 6,
                            name: 'fk_id_client',
                            label: 'Cliente',
                            type: 'select',
                            options : clients.map(c => ({value : c.id_client, label : c.fancy_name})),
                            required: true
                        },{
                            col: 6,
                            name: 'fk_id_agency',
                            label: 'Agência',
                            type: 'select',
                            options : agencies.map(a => ({value : a.id_agency, label : a.fancy_name})),
                            required: true
                        },{
                            col: 12,
                            name: 'gross_value',
                            label: 'Valor Bruto',
                            type: 'number',
                            required: true
                        },{
                            col: 6,
                            name: 'dt_start',
                            label: 'Data de início',
                            type: 'date',
                            required: true
                        },{
                            col: 6,
                            name: 'dt_end',
                            label: 'Data de Fechamento',
                            type: 'date',
                            required: true
                        },{
                            col: 12,
                            name: 'place_sell',
                            label: 'Local de venda',
                            type: 'text',
                            required: true
                        },{
                            col: 12,
                            name: 'id_column',
                            label: 'Funil de vendas',
                            type: 'select',
                            options : kanban.map(k=> ({value : k.id_column_card, label : k.name})),
                            required: true
                        },
                        
                        {
                            col: 12,
                            name: 'observation',
                            label : 'Observações',
                            type : 'textarea'
                        }
                    ]}
                    onSubmit={createNewBusiness}

                />
            </CommonDialog>
            <div style={{ height: '100%' }} className={clsx('flex flex-1 overflow-x-auto overflow-y-hidden')}>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list" type="list" direction="horizontal">
                        {(provided) => (
                            <div ref={provided.innerRef} className="flex container py-16 md:py-24 px-8 md:px-12">
                                {kanban.map((list, index) => (
                                    <BoardList getData={getData}
                                        key={list.id_kanban_column}
                                        list={list}
                                        index={index}
                                        cards={cards.filter(c => c.id_column == parseInt(index + 1))}
                                        usersOptions={usersOptions} />
                                ))}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}