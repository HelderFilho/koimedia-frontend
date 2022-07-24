import { Draggable, Droppable } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import BoardCard from './BoardCard';
import clsx from 'clsx';
import RootRef from '@material-ui/core/RootRef';
import { useState, useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';
import './home.css'
import Store from 'app/utils/Store'
let logged_user = Store.USER
import CommonDialog from "app/components/dialog/CommonDialog";
import CommonForm from "app/components/form/CommonForm";
import axios from 'axios';
import Constants from 'app/utils/Constants';
import ConfirmDialog from "app/components/dialog/ConfirmDialog";

import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
export default function BoardList({ getData, list, key, index, usersOptions, cards }) {
    const [openCreateNewCard, setOpenCreateNewCard] = useState(false)
    const [openColumnEdit, setOpenColumnEdit] = useState(false)
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
    const totalGrossValueFromCards = cards.reduce((sum, nextCard) => {
        return sum + parseFloat(nextCard.gross_value)
    }, 0)
    const contentScrollEl = useRef(null);
    const createNewCard = (values) => {
        values.user_cad = logged_user.id_user
        values.id_column = list.id_column_card
        axios.post(Constants.APIEndpoints.KANBAN + "/createCard", values).then(res => {
            setOpenCreateNewCard(false)
            getData()
        })
    }

    const editColumn = (values) => {
        values.fk_id_kanban_column = list.id_column_card
        axios.post(Constants.APIEndpoints.KANBAN + "/updateColumn", values).then(res => {
            setOpenColumnEdit(false)
            getData()
        })
    }

    const deleteColumn = () => {
        axios.post(Constants.APIEndpoints.KANBAN + "/deleteColumn", { fk_id_kanban_column: list.id_column_card }).then(res => {
            getData()
        })
    }
    return (
        <div>

            <Draggable draggableId={list.id_column_card} index={index} type="list">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Card
                            className={clsx(
                                snapshot.isDragging ? 'shadow-lg' : 'shadow',
                                'w-256 sm:w-320 mx-8 sm:mx-12 max-h-full flex flex-col rounded-20'
                            )}
                            square
                        >
                            <Typography className="titleColumn">{list.name}</Typography>

                            <Typography className="cardTotalValueAndBusiness">{`${totalGrossValueFromCards.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} - ${cards.length} negócios`}</Typography>

                            <RootRef rootRef={contentScrollEl}>
                                <CardContent className="flex flex-col flex-1 flex-auto h-full min-h-0 w-full p-0 overflow-auto">
                                    <Droppable droppableId={list.id_column_card} type="card" direction="vertical">
                                        {(_provided) => (
                                            <div ref={_provided.innerRef} className="flex flex-col w-full h-full p-16">


                                                {Array.from(cards || []).map((card, index) => (
                                                    <BoardCard getData={getData} card={card} index={index} list={list} usersOptions={usersOptions} />
                                                ))}
                                                {_provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </CardContent>
                            </RootRef>
                            {list.id_kanban_column == 0 ? null : (
                                <CardActions className="p-0 flex-shrink-0">
                                    <div className='divCreateNewCard' onClick={() => setOpenCreateNewCard(true)}>Novo card</div>
                                    {/*<BoardAddCard listId={list.id_kanban_column} onCardAdded={() => console.log('ds')} />*/}
                                </CardActions>
                            )}
                        </Card>
                    </div>
                )}
            </Draggable>
            <CommonDialog
                open={openCreateNewCard}
                onClose={() => setOpenCreateNewCard(false)}
                title="Criar Novo Card"
                width="lg"
            >
                <CommonForm
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
                        },
                        {
                            col: 12,
                            name: 'observation',
                            label : 'Observações',
                            type : 'textarea'
                        }
                    ]}
                    onSubmit={createNewCard}


                />
            </CommonDialog>
            <CommonDialog
                open={openColumnEdit}
                onClose={() => setOpenColumnEdit(false)}
                title="Editar Coluna"
                width="xl"
            >
                <CommonForm
                    values={list}
                    fields={[
                        {
                            col: 12,
                            name: 'name',
                            label: 'Nome',
                            type: 'text',
                            required: true
                        }

                    ]}
                    onSubmit={editColumn}
                />

            </CommonDialog>
            {deleteDialog ? (
                <ConfirmDialog title="Deseja deletar esta coluna (isso apagará todos os cards dentro dela)?" cancel={() => setDeleteDialog(false)} confirm={deleteColumn} />
            ) : null}
        </div>
    )
}