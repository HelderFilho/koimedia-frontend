import { Draggable } from 'react-beautiful-dnd';
import Card from '@material-ui/core/Card';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import './home.css'
import { useState } from 'react';
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

export default function BoardCard({ getData, card, index, list, usersOptions }) {
    const [openCard, setOpenCard] = useState(false)
    const [openCardEdit, setOpenCardEdit] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
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
            <Draggable draggableId={'card' + card.id_kanban_card} index={index} type="card">
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

                                {card.user_cad == logged_user.id_user && (
                                    <IconButton
                                        onClick={(ev) => {
                                            setOpenCard(false)
                                            setOpenCardEdit(true)
                                        }}
                                    >
                                        <Icon style={{ color: 'white' }}>edit</Icon>
                                    </IconButton>
                                )}

                                {card.user_cad == logged_user.id_user && (
                                    <IconButton
                                        onClick={(ev) => {
                                            setDeleteDialog(true)
                                        }}
                                    >
                                        <Icon style={{ color: 'white' }}>delete</Icon>
                                    </IconButton>
                                )}
                            </div>
                            <div onClick={(ev) => setOpenCard(true)}
                                className='descriptionCard' dangerouslySetInnerHTML={{ __html: card.description }}></div>



                        </Card>
                    </div>
                )}
            </Draggable>
            <CommonDialog
                open={openCard}
                onClose={() => setOpenCard(false)}
                title="Visualizar  Card"
                width="xl"
            >
                <Typography className="subjectCard">{card.subject}</Typography>

                <div dangerouslySetInnerHTML={{ __html: card.description }}></div>

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
                    onSubmit={editCard}
                />

            </CommonDialog>
            {deleteDialog ? (
                <ConfirmDialog title="Deseja deletar este card?" cancel={() => setDeleteDialog(false)} confirm={deleteCard} />
            ) : null}
        </div>
    )
}