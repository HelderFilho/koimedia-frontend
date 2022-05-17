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
export default function BoardList({ getData, list, key, index, usersOptions }) {
    const [openCreateNewCard, setOpenCreateNewCard] = useState(false)
    const [openColumnEdit, setOpenColumnEdit] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
 
    console.log('list', list)
    const contentScrollEl = useRef(null);
    const createNewCard = (values) => {
        values.user_cad = logged_user.id_user
        values.fk_id_kanban_column = list.id_kanban_column
        axios.post(Constants.APIEndpoints.KANBAN + "/createCard", values).then(res => {
            setOpenCreateNewCard(false)
            getData()
        })
    }

    const editColumn = (values) => {
        values.fk_id_kanban_column = list.id_kanban_column
        axios.post(Constants.APIEndpoints.KANBAN + "/updateColumn", values).then(res => {
            setOpenColumnEdit(false)
            getData()
        })
    }

    const deleteColumn = () => {
        axios.post(Constants.APIEndpoints.KANBAN + "/deleteColumn", { fk_id_kanban_column: list.id_kanban_column }).then(res => {
            getData()
        })
    }
    return (
        <div>
            <Draggable draggableId={'column' + list.id_kanban_column} index={index} type="list">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                        <Card
                            className={clsx(
                                snapshot.isDragging ? 'shadow-lg' : 'shadow',
                                'w-256 sm:w-320 mx-8 sm:mx-12 max-h-full flex flex-col rounded-20'
                            )}
                            square
                        >
                            <div style={{ display: 'flex' }}>

                                <Typography className="titleColumn">{list.name}</Typography>
                                {list.user_cad == logged_user.id_user && (
                                    <IconButton
                                        onClick={(ev) => {
                                            setOpenColumnEdit(true)
                                        }}
                                    >
                                        <Icon style={{ color: 'black' }}>edit</Icon>
                                    </IconButton>
                                )}

                                {list.user_cad == logged_user.id_user && (
                                    <IconButton
                                        onClick={(ev) => {
                                            setDeleteDialog(true)
                                        }}
                                    >
                                        <Icon style={{ color: 'black' }}>delete</Icon>
                                    </IconButton>
                                )}
                            </div>

                            <RootRef rootRef={contentScrollEl}>
                                <CardContent className="flex flex-col flex-1 flex-auto h-full min-h-0 w-full p-0 overflow-auto">
                                    <Droppable droppableId={'column' + list.id_kanban_column} type="card" direction="vertical">
                                        {(_provided) => (
                                            <div ref={_provided.innerRef} className="flex flex-col w-full h-full p-16">


                                                {Array.from(list.cards || []).map((card, index) => (
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
                            col: 12,
                            name: 'subject',
                            label: 'Assunto',
                            type: 'text',
                            required: true
                        },
                        {
                            col: 12,
                            name: 'description',
                            label: 'Descrição',
                            type: 'textarea',
                        }, {
                            col: 12,
                            name: 'users',
                            label: 'Outras pessoas que verão o card',
                            type: 'multiselect',
                            options: usersOptions,
                        },

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