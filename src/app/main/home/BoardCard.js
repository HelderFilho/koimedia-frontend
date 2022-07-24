import { Draggable } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import './home.css'
import { useState, useEffect } from 'react';
import CommonDialog from "app/components/dialog/CommonDialog";
import CommonForm from "app/components/form/CommonForm";

import Store from 'app/utils/Store'
let logged_user = Store.USER
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Constants from 'app/utils/Constants';
import axios from 'axios';
import { values } from 'lodash';
import ConfirmDialog from "app/components/dialog/ConfirmDialog";
import moment from 'moment';
export default function BoardCard({ getData, card, index, list, usersOptions }) {
    const [openCard, setOpenCard] = useState(false)
    const [openCardEdit, setOpenCardEdit] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)

    const [clients, setClients] = useState([])
    const [agencies, setAgencies] = useState([])

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
    useEffect(() => {
        getData();

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

    const editCard = (values) => {
        values.fk_id_kanban_column = list.id_kanban_column
        values.fk_id_kanban_card = card.id_kanban_card
        axios.post(Constants.APIEndpoints.KANBAN + "/updateCard", values).then(res => {
            setOpenCardEdit(false)
            getData()
        })
    }

    const deleteCard = () => {
        axios.post(Constants.APIEndpoints.KANBAN + "/deleteCard", { fk_id_kanban_card: card.id_kanban_card }).then(res => {
            getData()
        })
    }
    
    return (
        <div>
            <Draggable draggableId={'card' + card.id_cards} index={index} type="card">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Card
                            className={clsx(
                                snapshot.isDragging ? 'shadow-lg' : 'shadow-0',
                                'w-full mb-16 rounded-16 cursor-pointer cardKanban'
                            )}
                        >
                            <div style={{ display: 'flex', backgroundColor: '#1b2330' }}>
                                <Typography onClick={(ev) => setOpenCard(true)}
                                    className="subjectCard">{card.subject}
                                </Typography>

                                <IconButton
                                    onClick={(ev) => {
                                        setOpenCard(false)
                                        setOpenCardEdit(true)
                                    }}
                                >
                                    <Icon style={{ color: 'white' }}>edit</Icon>
                                </IconButton>
                                <IconButton
                                    onClick={(ev) => {
                                        setDeleteDialog(true)
                                    }}
                                >
                                    <Icon style={{ color: 'white' }}>delete</Icon>
                                </IconButton>
                            </div>
                            <div className='cardContent' onClick={(ev) => setOpenCard(true)}>
                                <Typography >{card.name_client}
                                </Typography>
                                <Typography >{card.gross_value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                </Typography>
                                <Typography >{`${moment(card.dt_start).format('DD/MM/YYYY')} à ${moment(card.dt_end).format('DD/MM/YYYY')}`}
                                </Typography>

                            </div>

                        </Card>
                    </div>
                )}
            </Draggable>
            <CommonDialog
                open={openCard}
                onClose={() => setOpenCard(false)}
                title="Visualizar Negócio"
                width="lg"
            >
                <Typography className="subjectCard"
                style = {{fontSize: 20}}>{card.subject}</Typography>
                <div className='divViewCardCContent'>
                    <Typography>Cliente: </Typography>
                    <Typography>{card.name_client}</Typography>
                </div>
                <div className='divViewCardCContent'>
                    <Typography>Contato: </Typography>
                    <Typography>{card.contact}</Typography>
                </div>
                <div className='divViewCardCContent'>
                    <Typography>Valor Bruto: </Typography>
                    <Typography>{card.gross_value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</Typography>
                </div>
                <div className='divViewCardCContent'>
                    <Typography>Lugar de venda: </Typography>
                    <Typography>{card.place_sell}</Typography>
                </div>
                <div className='divViewCardCContent'>
                    <Typography>Agência: </Typography>
                    <Typography>{card.name_agency}</Typography>
                </div>
                <div className='divViewCardCContent'>
                    <Typography>Período: </Typography>
                    <Typography>{`${moment(card.dt_start).format('DD/MM/YYYY')} à ${moment(card.dt_end).format('DD/MM/YYYY')}`}</Typography>
                </div>
                <div className='divViewCardCContent'>
                    <Typography>Usuário que Cadastrou: </Typography>
                    <Typography>{card.name_user}</Typography>
                </div>
                <div className='divViewCardCContentObservation'>
                    <Typography className='labelViewCardCContentObservation'>Observações: </Typography>
                    <label dangerouslySetInnerHTML={{ __html: card.observation }}></label>
                </div>
                
                

            </CommonDialog>
            <CommonDialog
                open={openCardEdit}
                onClose={() => setOpenCardEdit(false)}
                title="Editar Card"
                width="xl"
            >
                <CommonForm
                    values={card}
                    fields={[
                        {
                            col: 6,
                            name: 'subject',
                            label: 'Título',
                            type: 'text',
                            required: true
                        }, {
                            col: 6,
                            name: 'contact',
                            label: 'Contato',
                            type: 'text',
                            required: true
                        }, {
                            col: 6,
                            name: 'fk_id_client',
                            label: 'Cliente',
                            type: 'select',
                            options: clients.map(c => ({ value: c.id_client, label: c.fancy_name })),
                            required: true
                        }, {
                            col: 6,
                            name: 'fk_id_agency',
                            label: 'Agência',
                            type: 'select',
                            options: agencies.map(a => ({ value: a.id_agency, label: a.fancy_name })),
                            required: true
                        }, {
                            col: 12,
                            name: 'gross_value',
                            label: 'Valor Bruto',
                            type: 'number',
                            required: true
                        }, {
                            col: 6,
                            name: 'dt_start',
                            label: 'Data de início',
                            type: 'date',
                            required: true
                        }, {
                            col: 6,
                            name: 'dt_end',
                            label: 'Data de Fechamento',
                            type: 'date',
                            required: true
                        }, {
                            col: 12,
                            name: 'place_sell',
                            label: 'Local de venda',
                            type: 'text',
                            required: true
                        }, {
                            col: 12,
                            name: 'id_column',
                            label: 'Funil de vendas',
                            type: 'select',
                            options: kanban.map(k => ({ value: k.id_column_card, label: k.name })),
                            required: true
                        },
                        {
                            col: 12,
                            name: 'observation',
                            label : 'Observações',
                            type : 'textarea'
                        }
                    ]}
                    onSubmit={editCard}
                />

            </CommonDialog>
            {deleteDialog ? (
                <ConfirmDialog title="Deseja deletar este card?" cancel={() => setDeleteDialog(false)} confirm={deleteCard} />
            ) : null}
        </div>
    )
}